import { checkIsManualRevalidate, PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER } from ".";
import bytes from "neer/dist/compiled/bytes";
import { generateETag } from "../lib/etag";
import { sendEtagResponse } from "../send-payload";
import { Stream } from "stream";
import { parse } from "neer/dist/compiled/content-type";
import isError from "../../lib/is-error";
import { isResSent } from "../../shared/lib/utils";
import { interopDefault } from "../../lib/interop-default";
import { getCookieParser, setLazyProp, sendStatusCode, redirect, clearPreviewData, sendError, ApiError, PRERENDER_REVALIDATE_HEADER, COOKIE_NAME_PRERENDER_BYPASS, COOKIE_NAME_PRERENDER_DATA, SYMBOL_PREVIEW_DATA, RESPONSE_LIMIT_DEFAULT } from "./index";
import { mockRequest } from "../lib/mock-request";
export function tryGetPreviewData(req, res, options) {
    // if an On-Demand revalidation is being done preview mode
    // is disabled
    if (options && checkIsManualRevalidate(req, options).isManualRevalidate) {
        return false;
    }
    // Read cached preview data if present
    if (SYMBOL_PREVIEW_DATA in req) {
        return req[SYMBOL_PREVIEW_DATA];
    }
    const getCookies = getCookieParser(req.headers);
    let cookies;
    try {
        cookies = getCookies();
    } catch  {
        // TODO: warn
        return false;
    }
    const hasBypass = COOKIE_NAME_PRERENDER_BYPASS in cookies;
    const hasData = COOKIE_NAME_PRERENDER_DATA in cookies;
    // Case: neither cookie is set.
    if (!(hasBypass || hasData)) {
        return false;
    }
    // Case: one cookie is set, but not the other.
    if (hasBypass !== hasData) {
        clearPreviewData(res);
        return false;
    }
    // Case: preview session is for an old build.
    if (cookies[COOKIE_NAME_PRERENDER_BYPASS] !== options.previewModeId) {
        clearPreviewData(res);
        return false;
    }
    const tokenPreviewData = cookies[COOKIE_NAME_PRERENDER_DATA];
    let encryptedPreviewData;
    try {
        const jsonwebtoken = require("neer/dist/compiled/jsonwebtoken");
        encryptedPreviewData = jsonwebtoken.verify(tokenPreviewData, options.previewModeSigningKey);
    } catch  {
        // TODO: warn
        clearPreviewData(res);
        return false;
    }
    const { decryptWithSecret  } = require("../crypto-utils");
    const decryptedPreviewData = decryptWithSecret(Buffer.from(options.previewModeEncryptionKey), encryptedPreviewData.data);
    try {
        // TODO: strict runtime type checking
        const data = JSON.parse(decryptedPreviewData);
        // Cache lookup
        Object.defineProperty(req, SYMBOL_PREVIEW_DATA, {
            value: data,
            enumerable: false
        });
        return data;
    } catch  {
        return false;
    }
}
/**
 * Parse `JSON` and handles invalid `JSON` strings
 * @param str `JSON` string
 */ function parseJson(str) {
    if (str.length === 0) {
        // special-case empty json body, as it's a common client-side mistake
        return {};
    }
    try {
        return JSON.parse(str);
    } catch (e) {
        throw new ApiError(400, "Invalid JSON");
    }
}
/**
 * Parse incoming message like `json` or `urlencoded`
 * @param req request object
 */ export async function parseBody(req, limit) {
    let contentType;
    try {
        contentType = parse(req.headers["content-type"] || "text/plain");
    } catch  {
        contentType = parse("text/plain");
    }
    const { type , parameters  } = contentType;
    const encoding = parameters.charset || "utf-8";
    let buffer;
    try {
        const getRawBody = require("neer/dist/compiled/raw-body");
        buffer = await getRawBody(req, {
            encoding,
            limit
        });
    } catch (e) {
        if (isError(e) && e.type === "entity.too.large") {
            throw new ApiError(413, `Body exceeded ${limit} limit`);
        } else {
            throw new ApiError(400, "Invalid body");
        }
    }
    const body = buffer.toString();
    if (type === "application/json" || type === "application/ld+json") {
        return parseJson(body);
    } else if (type === "application/x-www-form-urlencoded") {
        const qs = require("querystring");
        return qs.decode(body);
    } else {
        return body;
    }
}
function getMaxContentLength(responseLimit) {
    if (responseLimit && typeof responseLimit !== "boolean") {
        return bytes.parse(responseLimit);
    }
    return RESPONSE_LIMIT_DEFAULT;
}
/**
 * Send `any` body to response
 * @param req request object
 * @param res response object
 * @param body of response
 */ function sendData(req, res, body) {
    if (body === null || body === undefined) {
        res.end();
        return;
    }
    // strip irrelevant headers/body
    if (res.statusCode === 204 || res.statusCode === 304) {
        res.removeHeader("Content-Type");
        res.removeHeader("Content-Length");
        res.removeHeader("Transfer-Encoding");
        if (process.env.NODE_ENV === "development" && body) {
            console.warn(`A body was attempted to be set with a 204 statusCode for ${req.url}, this is invalid and the body was ignored.\n` + `See more info here https://nextjs.org/docs/messages/invalid-api-status-body`);
        }
        res.end();
        return;
    }
    const contentType = res.getHeader("Content-Type");
    if (body instanceof Stream) {
        if (!contentType) {
            res.setHeader("Content-Type", "application/octet-stream");
        }
        body.pipe(res);
        return;
    }
    const isJSONLike = [
        "object",
        "number",
        "boolean"
    ].includes(typeof body);
    const stringifiedBody = isJSONLike ? JSON.stringify(body) : body;
    const etag = generateETag(stringifiedBody);
    if (sendEtagResponse(req, res, etag)) {
        return;
    }
    if (Buffer.isBuffer(body)) {
        if (!contentType) {
            res.setHeader("Content-Type", "application/octet-stream");
        }
        res.setHeader("Content-Length", body.length);
        res.end(body);
        return;
    }
    if (isJSONLike) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    res.setHeader("Content-Length", Buffer.byteLength(stringifiedBody));
    res.end(stringifiedBody);
}
/**
 * Send `JSON` object
 * @param res response object
 * @param jsonBody of data
 */ function sendJson(res, jsonBody) {
    // Set header to application/json
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // Use send to handle request
    res.send(JSON.stringify(jsonBody));
}
function isNotValidData(str) {
    return typeof str !== "string" || str.length < 16;
}
function setPreviewData(res, data, options) {
    if (isNotValidData(options.previewModeId)) {
        throw new Error("invariant: invalid previewModeId");
    }
    if (isNotValidData(options.previewModeEncryptionKey)) {
        throw new Error("invariant: invalid previewModeEncryptionKey");
    }
    if (isNotValidData(options.previewModeSigningKey)) {
        throw new Error("invariant: invalid previewModeSigningKey");
    }
    const jsonwebtoken = require("neer/dist/compiled/jsonwebtoken");
    const { encryptWithSecret  } = require("../crypto-utils");
    const payload = jsonwebtoken.sign({
        data: encryptWithSecret(Buffer.from(options.previewModeEncryptionKey), JSON.stringify(data))
    }, options.previewModeSigningKey, {
        algorithm: "HS256",
        ...options.maxAge !== undefined ? {
            expiresIn: options.maxAge
        } : undefined
    });
    // limit preview mode cookie to 2KB since we shouldn't store too much
    // data here and browsers drop cookies over 4KB
    if (payload.length > 2048) {
        throw new Error(`Preview data is limited to 2KB currently, reduce how much data you are storing as preview data to continue`);
    }
    const { serialize  } = require("neer/dist/compiled/cookie");
    const previous = res.getHeader("Set-Cookie");
    res.setHeader(`Set-Cookie`, [
        ...typeof previous === "string" ? [
            previous
        ] : Array.isArray(previous) ? previous : [],
        serialize(COOKIE_NAME_PRERENDER_BYPASS, options.previewModeId, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
            ...options.maxAge !== undefined ? {
                maxAge: options.maxAge
            } : undefined,
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        }),
        serialize(COOKIE_NAME_PRERENDER_DATA, payload, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
            ...options.maxAge !== undefined ? {
                maxAge: options.maxAge
            } : undefined,
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        }), 
    ]);
    return res;
}
async function revalidate(urlPath, opts, req, context) {
    if (typeof urlPath !== "string" || !urlPath.startsWith("/")) {
        throw new Error(`Invalid urlPath provided to revalidate(), must be a path e.g. /blog/post-1, received ${urlPath}`);
    }
    const revalidateHeaders = {
        [PRERENDER_REVALIDATE_HEADER]: context.previewModeId,
        ...opts.unstable_onlyGenerated ? {
            [PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER]: "1"
        } : {}
    };
    try {
        if (context.trustHostHeader) {
            const res = await fetch(`https://${req.headers.host}${urlPath}`, {
                method: "HEAD",
                headers: {
                    ...revalidateHeaders,
                    cookie: req.headers.cookie || ""
                }
            });
            // we use the cache header to determine successful revalidate as
            // a non-200 status code can be returned from a successful revalidate
            // e.g. notFound: true returns 404 status code but is successful
            const cacheHeader = res.headers.get("x-vercel-cache") || res.headers.get("x-nextjs-cache");
            if ((cacheHeader == null ? void 0 : cacheHeader.toUpperCase()) !== "REVALIDATED" && !(res.status === 404 && opts.unstable_onlyGenerated)) {
                throw new Error(`Invalid response ${res.status}`);
            }
        } else if (context.revalidate) {
            const { req: mockReq , res: mockRes , streamPromise ,  } = mockRequest(urlPath, revalidateHeaders, "GET");
            await context.revalidate(mockReq, mockRes);
            await streamPromise;
            if (mockRes.getHeader("x-nextjs-cache") !== "REVALIDATED" && !(mockRes.statusCode === 404 && opts.unstable_onlyGenerated)) {
                throw new Error(`Invalid response ${mockRes.statusCode}`);
            }
        } else {
            throw new Error(`Invariant: required internal revalidate method not passed to api-utils`);
        }
    } catch (err) {
        throw new Error(`Failed to revalidate ${urlPath}: ${isError(err) ? err.message : err}`);
    }
}
export async function apiResolver(req, res, query, resolverModule, apiContext, propagateError, dev, page) {
    const apiReq = req;
    const apiRes = res;
    try {
        var ref, ref1, ref2;
        if (!resolverModule) {
            res.statusCode = 404;
            res.end("Not Found");
            return;
        }
        const config = resolverModule.config || {};
        const bodyParser = ((ref = config.api) == null ? void 0 : ref.bodyParser) !== false;
        const responseLimit = ((ref1 = config.api) == null ? void 0 : ref1.responseLimit) ?? true;
        const externalResolver = ((ref2 = config.api) == null ? void 0 : ref2.externalResolver) || false;
        // Parsing of cookies
        setLazyProp({
            req: apiReq
        }, "cookies", getCookieParser(req.headers));
        // Parsing query string
        apiReq.query = query;
        // Parsing preview data
        setLazyProp({
            req: apiReq
        }, "previewData", ()=>tryGetPreviewData(req, res, apiContext));
        // Checking if preview mode is enabled
        setLazyProp({
            req: apiReq
        }, "preview", ()=>apiReq.previewData !== false ? true : undefined);
        // Parsing of body
        if (bodyParser && !apiReq.body) {
            apiReq.body = await parseBody(apiReq, config.api && config.api.bodyParser && config.api.bodyParser.sizeLimit ? config.api.bodyParser.sizeLimit : "1mb");
        }
        let contentLength = 0;
        const maxContentLength = getMaxContentLength(responseLimit);
        const writeData = apiRes.write;
        const endResponse = apiRes.end;
        apiRes.write = (...args)=>{
            contentLength += Buffer.byteLength(args[0] || "");
            return writeData.apply(apiRes, args);
        };
        apiRes.end = (...args)=>{
            if (args.length && typeof args[0] !== "function") {
                contentLength += Buffer.byteLength(args[0] || "");
            }
            if (responseLimit && contentLength >= maxContentLength) {
                console.warn(`API response for ${req.url} exceeds ${bytes.format(maxContentLength)}. API Routes are meant to respond quickly. https://nextjs.org/docs/messages/api-routes-response-size-limit`);
            }
            endResponse.apply(apiRes, args);
        };
        apiRes.status = (statusCode)=>sendStatusCode(apiRes, statusCode);
        apiRes.send = (data)=>sendData(apiReq, apiRes, data);
        apiRes.json = (data)=>sendJson(apiRes, data);
        apiRes.redirect = (statusOrUrl, url)=>redirect(apiRes, statusOrUrl, url);
        apiRes.setPreviewData = (data, options = {})=>setPreviewData(apiRes, data, Object.assign({}, apiContext, options));
        apiRes.clearPreviewData = (options = {})=>clearPreviewData(apiRes, options);
        apiRes.revalidate = (urlPath, opts)=>revalidate(urlPath, opts || {}, req, apiContext);
        const resolver = interopDefault(resolverModule);
        let wasPiped = false;
        if (process.env.NODE_ENV !== "production") {
            // listen for pipe event and don't show resolve warning
            res.once("pipe", ()=>wasPiped = true);
        }
        // Call API route method
        await resolver(req, res);
        if (process.env.NODE_ENV !== "production" && !externalResolver && !isResSent(res) && !wasPiped) {
            console.warn(`API resolved without sending a response for ${req.url}, this may result in stalled requests.`);
        }
    } catch (err) {
        if (err instanceof ApiError) {
            sendError(apiRes, err.statusCode, err.message);
        } else {
            if (dev) {
                if (isError(err)) {
                    err.page = page;
                }
                throw err;
            }
            console.error(err);
            if (propagateError) {
                throw err;
            }
            sendError(apiRes, 500, "Internal Server Error");
        }
    }
}

//# sourceMappingURL=node.js.map