/**
 * This is a TypeScript language service plugin for Next.js app directory,
 * it provides the following features:
 *
 * - Warns about disallowed React APIs in server components.
 * - Warns about disallowed layout and page exports.
 * - Autocompletion for entry configurations.
 * - Hover hint and docs for entry configurations.
 */ import path from "path";
import fs from "fs";
const DISALLOWED_SERVER_REACT_APIS = [
    "useState",
    "useEffect",
    "useLayoutEffect",
    "useDeferredValue",
    "useImperativeHandle",
    "useInsertionEffect",
    "useReducer",
    "useRef",
    "useSyncExternalStore",
    "useTransition",
    "Component",
    "PureComponent",
    "createContext",
    "createFactory", 
];
const ALLOWED_EXPORTS = [
    "config",
    "generateStaticParams"
];
const ALLOWED_PAGE_PROPS = [
    "params",
    "searchParams"
];
const ALLOWED_LAYOUT_PROPS = [
    "params",
    "children"
];
const NEXT_TS_ERRORS = {
    INVALID_SERVER_API: 71001,
    INVALID_ENTRY_EXPORT: 71002,
    INVALID_OPTION_VALUE: 71003,
    MISPLACED_CLIENT_ENTRY: 71004,
    INVALID_PAGE_PROP: 71005
};
const API_DOCS = {
    dynamic: {
        description: "The `dynamic` option provides a few ways to opt in or out of dynamic behavior.",
        options: {
            '"auto"': "Heuristic to cache as much as possible but doesn\u2019t prevent any component to opt-in to dynamic behavior.",
            '"force-dynamic"': "This disables all caching of fetches and always revalidates. (This is equivalent to `getServerSideProps`.)",
            '"error"': "This errors if any dynamic Hooks or fetches are used. (This is equivalent to `getStaticProps`.)",
            '"force-static"': "This forces caching of all fetches and returns empty values from `useCookies`, `useHeaders` and `useSearchParams`."
        },
        link: "https://beta.nextjs.org/docs/api-reference/segment-config#dynamic"
    },
    fetchCache: {
        description: "The `fetchCache` option controls how Next.js statically caches fetches. By default it statically caches fetches reachable before any dynamic Hooks are used, and it doesn\u2019t cache fetches that are discovered after that.",
        options: {
            '"force-no-store"': "This lets you intentionally opt-out of all caching of data. This option forces all fetches to be refetched every request even if the `cache: 'force-cache'` option is passed to `fetch()`.",
            '"only-no-store"': "This lets you enforce that all data opts out of caching. This option makes `fetch()` reject with an error if `cache: 'force-cache'` is provided. It also changes the default to `no-store`.",
            '"default-no-store"': "Allows any explicit `cache` option to be passed to `fetch()` but if `'default'`, or no option, is provided then it defaults to `'no-store'`. This means that even fetches before a dynamic Hook are considered dynamic.",
            '"auto"': "This is the default option. It caches any fetches with the default `cache` option provided, that happened before a dynamic Hook is used and don\u2019t cache any such fetches if they\u2019re issued after a dynamic Hook.",
            '"default-cache"': "Allows any explicit `cache` option to be passed to `fetch()` but if `'default'`, or no option, is provided then it defaults to `'force-cache'`. This means that even fetches before a dynamic Hook are considered dynamic.",
            '"only-cache"': "This lets you enforce that all data opts into caching. This option makes `fetch()` reject with an error if `cache: 'force-cache'` is provided. It also changes the default to `force-cache`. This error can be discovered early during static builds - or dynamically during Edge rendering.",
            '"force-cache"': "This lets you intentionally opt-in to all caching of data. This option forces all fetches to be cache even if the `cache: 'no-store'` option is passed to `fetch()`."
        },
        link: "https://beta.nextjs.org/docs/api-reference/segment-config#fetchcache"
    },
    preferredRegion: {
        description: 'Specify the perferred region that this layout or page should be deployed to. If the region option is not specified, it inherits the option from the nearest parent layout. The root defaults to `"auto"`.',
        options: {
            '"auto"': 'Next.js will first deploy to the `"home"` region. Then if it doesn\u2019t detect any waterfall requests after a few requests, it can upgrade that route, to be deployed globally to `"edge"`. If it detects any waterfall requests after that, it can eventually downgrade back to `"home`".',
            '"home"': "Prefer deploying to the Home region.",
            '"edge"': "Prefer deploying to the Edge globally."
        },
        link: "https://beta.nextjs.org/docs/api-reference/segment-config#preferredregion"
    },
    revalidate: {
        description: "The `revalidate` option sets the default revalidation time for that layout or page. Note that it doesn\u2019t override the value specify by each `fetch()`.",
        type: "mixed",
        options: {
            false: "This is the default and changes the fetch cache to indefinitely cache anything that uses force-cache or is fetched before a dynamic Hook/fetch.",
            0: "Specifying `0` implies that this layout or page should never be static.",
            30: "Set the revalidation time to `30` seconds. The value can be `0` or any positive number."
        },
        link: "https://beta.nextjs.org/docs/api-reference/segment-config#revalidate",
        isValid: (value)=>{
            return value === "false" || Number(value) >= 0;
        },
        getHint: (value)=>{
            return `Set the default revalidation time to \`${value}\` seconds.`;
        }
    },
    dynamicParams: {
        description: "`dynamicParams` replaces the `fallback` option of `getStaticPaths`. It controls whether we allow `dynamicParams` beyond the generated static params from `generateStaticParams`.",
        options: {
            true: "Allow rendering dynamic params that are not generated by `generateStaticParams`.",
            false: "Disallow rendering dynamic params that are not generated by `generateStaticParams`."
        },
        link: "https://beta.nextjs.org/docs/api-reference/segment-config#dynamicparams"
    },
    runtime: {
        description: "The `runtime` option controls the preferred runtime to render this route.",
        options: {
            '"nodejs"': "Prefer the Node.js runtime.",
            '"edge"': "Prefer the Edge runtime.",
            '"experimental-edge"': "Prefer the experimental Edge runtime."
        },
        link: "https://beta.nextjs.org/docs/api-reference/segment-config#runtime"
    }
};
function getAPIDescription(api) {
    return API_DOCS[api].description + "\n\n" + Object.entries(API_DOCS[api].options).map(([key, value])=>`- \`${key}\`: ${value}`).join("\n");
}
function removeStringQuotes(str) {
    return str.replace(/^['"`]|['"`]$/g, "");
}
export function createTSPlugin(modules) {
    const ts = modules.typescript;
    function createAutoCompletionOptionName(sort, name) {
        return {
            name,
            sortText: "" + sort,
            kind: ts.ScriptElementKind.unknown,
            kindModifiers: ts.ScriptElementKindModifier.exportedModifier,
            labelDetails: {
                description: `Next.js ${name} option`
            },
            data: {
                exportName: name,
                moduleSpecifier: "neer/typescript/entry_option_name"
            }
        };
    }
    function createAutoCompletionOptionValue(sort, name, apiName) {
        const isString = name.startsWith('"');
        return {
            name,
            insertText: removeStringQuotes(name),
            sortText: "" + sort,
            kind: isString ? ts.ScriptElementKind.string : ts.ScriptElementKind.unknown,
            kindModifiers: ts.ScriptElementKindModifier.none,
            labelDetails: {
                description: `Next.js ${apiName} option`
            },
            data: {
                exportName: apiName,
                moduleSpecifier: "neer/typescript/entry_option_value"
            }
        };
    }
    function create(info) {
        const projectDir = info.project.getCurrentDirectory();
        const appDir = new RegExp("^" + (projectDir + "(/src)?/app").replace(/[\\/]/g, "[\\/]"));
        const isPositionInsideNode = (position, node)=>{
            const start = node.getFullStart();
            return start <= position && position <= node.getFullWidth() + start;
        };
        const isAppEntryFile = (filePath)=>{
            return appDir.test(filePath) && /^(page|layout)\.(mjs|js|jsx|ts|tsx)$/.test(path.basename(filePath));
        };
        const isPageFile = (filePath)=>{
            return appDir.test(filePath) && /^page\.(mjs|js|jsx|ts|tsx)$/.test(path.basename(filePath));
        };
        const isDefaultFunctionExport = (node)=>{
            if (ts.isFunctionDeclaration(node)) {
                let hasExportKeyword = false;
                let hasDefaultKeyword = false;
                if (node.modifiers) {
                    for (const modifier of node.modifiers){
                        if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
                            hasExportKeyword = true;
                        } else if (modifier.kind === ts.SyntaxKind.DefaultKeyword) {
                            hasDefaultKeyword = true;
                        }
                    }
                }
                // `export default function`
                if (hasExportKeyword && hasDefaultKeyword) {
                    return true;
                }
            }
            return false;
        };
        function getIsClientEntry(fileName, throwOnInvalidDirective) {
            var ref;
            const source = (ref = info.languageService.getProgram()) == null ? void 0 : ref.getSourceFile(fileName);
            if (source) {
                let isClientEntry = false;
                let isDirective = true;
                ts.forEachChild(source, (node)=>{
                    if (ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression)) {
                        if (node.expression.text === "use client") {
                            if (isDirective) {
                                isClientEntry = true;
                            } else {
                                if (throwOnInvalidDirective) {
                                    const e = {
                                        messageText: 'The `"use client"` directive must be put at the top of the file.',
                                        start: node.expression.getStart(),
                                        length: node.expression.getWidth()
                                    };
                                    throw e;
                                }
                            }
                        }
                    } else {
                        isDirective = false;
                    }
                });
                return isClientEntry;
            }
            return false;
        }
        function visitEntryConfig(fileName, position, callback) {
            var ref1;
            const source = (ref1 = info.languageService.getProgram()) == null ? void 0 : ref1.getSourceFile(fileName);
            if (source) {
                ts.forEachChild(source, function visit(node) {
                    // Covered by this node
                    if (node.getFullStart() <= position && position <= node.getFullStart() + node.getFullWidth()) {
                        var ref;
                        // Export variable
                        if (ts.isVariableStatement(node) && ((ref = node.modifiers) == null ? void 0 : ref.some((m)=>m.kind === ts.SyntaxKind.ExportKeyword))) {
                            if (ts.isVariableDeclarationList(node.declarationList)) {
                                for (const declarartion of node.declarationList.declarations){
                                    if (declarartion.getFullStart() <= position && position <= declarartion.getFullStart() + declarartion.getFullWidth()) {
                                        // `export const ... = ...`
                                        const text = declarartion.name.getText();
                                        callback(text, declarartion);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        function log(message) {
            info.project.projectService.logger.info(message);
        }
        log("Starting Next.js TypeScript plugin: " + projectDir);
        // Set up decorator object
        const proxy = Object.create(null);
        for (let k of Object.keys(info.languageService)){
            const x = info.languageService[k];
            proxy[k] = (...args)=>x.apply(info.languageService, args);
        }
        // Auto completion
        proxy.getCompletionsAtPosition = (fileName, position, options)=>{
            let prior = info.languageService.getCompletionsAtPosition(fileName, position, options) || {
                isGlobalCompletion: false,
                isMemberCompletion: false,
                isNewIdentifierLocation: false,
                entries: []
            };
            if (!isAppEntryFile(fileName)) return prior;
            // Remove specified entries from completion list if it's a server entry.
            if (!getIsClientEntry(fileName)) {
                prior.entries = prior.entries.filter((e)=>{
                    // Remove disallowed React APIs.
                    if (DISALLOWED_SERVER_REACT_APIS.includes(e.name) && e.kindModifiers === "declare") {
                        return false;
                    }
                    return true;
                });
            }
            // Auto completion for entry exported configs.
            visitEntryConfig(fileName, position, (entryConfig, declarartion)=>{
                if (!API_DOCS[entryConfig]) {
                    if (declarartion.name.getFullStart() <= position && position <= declarartion.name.getFullStart() + declarartion.name.getFullWidth()) {
                        prior.entries = [
                            ...prior.entries,
                            ...Object.keys(API_DOCS).map((name, index)=>{
                                return createAutoCompletionOptionName(index, name);
                            }), 
                        ];
                    }
                    return;
                }
                prior.entries = [
                    ...prior.entries,
                    ...Object.keys(API_DOCS[entryConfig].options).map((name, index)=>{
                        return createAutoCompletionOptionValue(index, name, entryConfig);
                    }), 
                ];
            });
            const program = info.languageService.getProgram();
            const source = program == null ? void 0 : program.getSourceFile(fileName);
            if (!source || !program) return prior;
            ts.forEachChild(source, (node)=>{
                // Auto completion for default export function's props.
                if (isDefaultFunctionExport(node) && isPositionInsideNode(position, node)) {
                    var ref;
                    const paramNode = (ref = node.parameters) == null ? void 0 : ref[0];
                    if (isPositionInsideNode(position, paramNode)) {
                        const props = paramNode == null ? void 0 : paramNode.name;
                        if (props && ts.isObjectBindingPattern(props)) {
                            let validProps = [];
                            let validPropsWithType = [];
                            let type;
                            if (isPageFile(fileName)) {
                                // For page entries (page.js), it can only have `params` and `searchParams`
                                // as the prop names.
                                validProps = ALLOWED_PAGE_PROPS;
                                validPropsWithType = ALLOWED_PAGE_PROPS;
                                type = "page";
                            } else {
                                // For layout entires, check if it has any named slots.
                                const currentDir = path.dirname(fileName);
                                const items = fs.readdirSync(currentDir, {
                                    withFileTypes: true
                                });
                                const slots = [];
                                for (const item of items){
                                    if (item.isDirectory() && item.name.startsWith("@")) {
                                        slots.push(item.name.slice(1));
                                    }
                                }
                                validProps = ALLOWED_LAYOUT_PROPS.concat(slots);
                                validPropsWithType = ALLOWED_LAYOUT_PROPS.concat(slots.map((s)=>`${s}: React.ReactNode`));
                                type = "layout";
                            }
                            // Auto completion for props
                            for (const element of props.elements){
                                if (isPositionInsideNode(position, element)) {
                                    const nameNode = element.propertyName || element.name;
                                    if (isPositionInsideNode(position, nameNode)) {
                                        for (const name of validProps){
                                            prior.entries.push({
                                                name,
                                                insertText: name,
                                                sortText: "_" + name,
                                                kind: ts.ScriptElementKind.memberVariableElement,
                                                kindModifiers: ts.ScriptElementKindModifier.none,
                                                labelDetails: {
                                                    description: `Next.js ${type} prop`
                                                }
                                            });
                                        }
                                    }
                                    break;
                                }
                            }
                            // Auto completion for types
                            if (paramNode.type && ts.isTypeLiteralNode(paramNode.type)) {
                                for (const member of paramNode.type.members){
                                    if (isPositionInsideNode(position, member)) {
                                        for (const name of validPropsWithType){
                                            prior.entries.push({
                                                name,
                                                insertText: name,
                                                sortText: "_" + name,
                                                kind: ts.ScriptElementKind.memberVariableElement,
                                                kindModifiers: ts.ScriptElementKindModifier.none,
                                                labelDetails: {
                                                    description: `Next.js ${type} prop type`
                                                }
                                            });
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            });
            return prior;
        };
        // Show auto completion details
        proxy.getCompletionEntryDetails = (fileName, position, entryName, formatOptions, source, preferences, data)=>{
            if (data && data.moduleSpecifier && data.moduleSpecifier.startsWith("neer/typescript")) {
                let content = "";
                if (data.moduleSpecifier === "neer/typescript/entry_option_name") {
                    content = getAPIDescription(entryName);
                } else {
                    content = API_DOCS[data.exportName].options[entryName];
                }
                return {
                    name: entryName,
                    kind: ts.ScriptElementKind.enumElement,
                    kindModifiers: ts.ScriptElementKindModifier.none,
                    displayParts: [],
                    documentation: [
                        {
                            kind: "text",
                            text: content
                        }, 
                    ]
                };
            }
            const prior = info.languageService.getCompletionEntryDetails(fileName, position, entryName, formatOptions, source, preferences, data);
            return prior;
        };
        // Quick info
        proxy.getQuickInfoAtPosition = (fileName, position)=>{
            const prior = info.languageService.getQuickInfoAtPosition(fileName, position);
            if (!isAppEntryFile(fileName)) return prior;
            // Remove type suggestions for disallowed APIs in server components.
            if (!getIsClientEntry(fileName)) {
                const definitions = info.languageService.getDefinitionAtPosition(fileName, position);
                if (definitions == null ? void 0 : definitions.some((d)=>DISALLOWED_SERVER_REACT_APIS.includes(d.name) && d.containerName === "React")) {
                    return;
                }
            }
            let overriden;
            visitEntryConfig(fileName, position, (entryConfig, declarartion)=>{
                if (!API_DOCS[entryConfig]) return;
                const name = declarartion.name;
                const value = declarartion.initializer;
                const docsLink = {
                    kind: "text",
                    text: `\n\nRead more about the "${entryConfig}" option: ` + API_DOCS[entryConfig].link
                };
                if (value && value.getFullStart() <= position && value.getFullStart() + value.getFullWidth() >= position) {
                    var _entryConfig, ref;
                    // Hovers the value of the config
                    const isString = ts.isStringLiteral(value);
                    const text = removeStringQuotes(value.getText());
                    const key = isString ? `"${text}"` : text;
                    const isValid = API_DOCS[entryConfig].isValid ? (ref = (_entryConfig = API_DOCS[entryConfig]).isValid) == null ? void 0 : ref.call(_entryConfig, key) : !!API_DOCS[entryConfig].options[key];
                    if (isValid) {
                        var _entryConfig1, ref2;
                        overriden = {
                            kind: ts.ScriptElementKind.enumElement,
                            kindModifiers: ts.ScriptElementKindModifier.none,
                            textSpan: {
                                start: value.getStart(),
                                length: value.getWidth()
                            },
                            displayParts: [],
                            documentation: [
                                {
                                    kind: "text",
                                    text: API_DOCS[entryConfig].options[key] || ((ref2 = (_entryConfig1 = API_DOCS[entryConfig]).getHint) == null ? void 0 : ref2.call(_entryConfig1, key)) || ""
                                },
                                docsLink, 
                            ]
                        };
                    } else {
                        // Wrong value, display the docs link
                        overriden = {
                            kind: ts.ScriptElementKind.enumElement,
                            kindModifiers: ts.ScriptElementKindModifier.none,
                            textSpan: {
                                start: value.getStart(),
                                length: value.getWidth()
                            },
                            displayParts: [],
                            documentation: [
                                docsLink
                            ]
                        };
                    }
                } else {
                    // Hovers the name of the config
                    overriden = {
                        kind: ts.ScriptElementKind.enumElement,
                        kindModifiers: ts.ScriptElementKindModifier.none,
                        textSpan: {
                            start: name.getStart(),
                            length: name.getWidth()
                        },
                        displayParts: [],
                        documentation: [
                            {
                                kind: "text",
                                text: getAPIDescription(entryConfig)
                            },
                            docsLink, 
                        ]
                    };
                }
            });
            if (overriden) return overriden;
            return prior;
        };
        // Show errors for disallowed imports
        proxy.getSemanticDiagnostics = (fileName)=>{
            const prior = info.languageService.getSemanticDiagnostics(fileName);
            if (!isAppEntryFile(fileName)) return prior;
            const program = info.languageService.getProgram();
            const source = program == null ? void 0 : program.getSourceFile(fileName);
            if (!source || !program) return prior;
            let isClientEntry = false;
            try {
                isClientEntry = getIsClientEntry(fileName, true);
            } catch (e) {
                prior.push({
                    file: source,
                    category: ts.DiagnosticCategory.Error,
                    code: NEXT_TS_ERRORS.MISPLACED_CLIENT_ENTRY,
                    ...e
                });
                isClientEntry = false;
            }
            ts.forEachChild(source, (node)=>{
                var ref;
                if (ts.isImportDeclaration(node)) {
                    if (!isClientEntry) {
                        const importPath = node.moduleSpecifier.getText(source);
                        if (importPath === "'react'" || importPath === '"react"') {
                            // Check if it imports "useState"
                            const importClause = node.importClause;
                            if (importClause) {
                                const namedBindings = importClause.namedBindings;
                                if (namedBindings && ts.isNamedImports(namedBindings)) {
                                    const elements = namedBindings.elements;
                                    for (const element of elements){
                                        const name = element.name.getText(source);
                                        if (DISALLOWED_SERVER_REACT_APIS.includes(name)) {
                                            prior.push({
                                                file: source,
                                                category: ts.DiagnosticCategory.Error,
                                                code: NEXT_TS_ERRORS.INVALID_SERVER_API,
                                                messageText: `"${name}" is not allowed in Server Components.`,
                                                start: element.name.getStart(),
                                                length: element.name.getWidth()
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (ts.isVariableStatement(node) && ((ref = node.modifiers) == null ? void 0 : ref.some((m)=>m.kind === ts.SyntaxKind.ExportKeyword))) {
                    // Check if it has correct option exports
                    if (ts.isVariableDeclarationList(node.declarationList)) {
                        for (const declarartion of node.declarationList.declarations){
                            const name = declarartion.name;
                            if (ts.isIdentifier(name)) {
                                if (!ALLOWED_EXPORTS.includes(name.text) && !API_DOCS[name.text]) {
                                    prior.push({
                                        file: source,
                                        category: ts.DiagnosticCategory.Error,
                                        code: NEXT_TS_ERRORS.INVALID_ENTRY_EXPORT,
                                        messageText: `"${name.text}" is not a valid Next.js entry export value.`,
                                        start: name.getStart(),
                                        length: name.getWidth()
                                    });
                                } else if (API_DOCS[name.text]) {
                                    // Check if the value is valid
                                    const value = declarartion.initializer;
                                    if (value) {
                                        let displayedValue = "";
                                        let errorMessage = "";
                                        let isInvalid = false;
                                        if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) {
                                            const text = removeStringQuotes(value.getText());
                                            const allowedValues = Object.keys(API_DOCS[name.text].options).filter((v)=>/^['"]/.test(v)).map(removeStringQuotes);
                                            if (!allowedValues.includes(text)) {
                                                isInvalid = true;
                                                displayedValue = `'${text}'`;
                                            }
                                        } else if (ts.isNumericLiteral(value) || ts.isPrefixUnaryExpression(value) && ts.isMinusToken(value.operator) && (ts.isNumericLiteral(value.operand.kind) || ts.isIdentifier(value.operand.kind) && value.operand.kind.getText() === "Infinity") || ts.isIdentifier(value) && value.getText() === "Infinity") {
                                            var _text, ref3;
                                            const v = value.getText();
                                            if (((ref3 = (_text = API_DOCS[name.text]).isValid) == null ? void 0 : ref3.call(_text, v)) === false) {
                                                isInvalid = true;
                                                displayedValue = v;
                                            }
                                        } else if (value.kind === ts.SyntaxKind.TrueKeyword || value.kind === ts.SyntaxKind.FalseKeyword) {
                                            var _text1, ref4;
                                            const v = value.getText();
                                            if (((ref4 = (_text1 = API_DOCS[name.text]).isValid) == null ? void 0 : ref4.call(_text1, v)) === false) {
                                                isInvalid = true;
                                                displayedValue = v;
                                            }
                                        } else if (// Other literals
                                        ts.isBigIntLiteral(value) || ts.isArrayLiteralExpression(value) || ts.isObjectLiteralExpression(value) || ts.isRegularExpressionLiteral(value) || ts.isPrefixUnaryExpression(value)) {
                                            isInvalid = true;
                                            displayedValue = value.getText();
                                        } else {
                                            // Not a literal, error because it's not statically analyzable
                                            isInvalid = true;
                                            displayedValue = value.getText();
                                            errorMessage = `"${displayedValue}" is not a valid value for the "${name.text}" option. The configuration must be statically analyzable.`;
                                        }
                                        if (isInvalid) {
                                            prior.push({
                                                file: source,
                                                category: ts.DiagnosticCategory.Error,
                                                code: NEXT_TS_ERRORS.INVALID_OPTION_VALUE,
                                                messageText: errorMessage || `"${displayedValue}" is not a valid value for the "${name.text}" option.`,
                                                start: value.getStart(),
                                                length: value.getWidth()
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (isDefaultFunctionExport(node)) {
                    var ref5, ref6;
                    // `export default function`
                    let validProps = [];
                    let type;
                    if (isPageFile(fileName)) {
                        // For page entries (page.js), it can only have `params` and `searchParams`
                        // as the prop names.
                        validProps = ALLOWED_PAGE_PROPS;
                        type = "page";
                    } else {
                        // For layout entires, check if it has any named slots.
                        const currentDir = path.dirname(fileName);
                        const items = fs.readdirSync(currentDir, {
                            withFileTypes: true
                        });
                        const slots = [];
                        for (const item of items){
                            if (item.isDirectory() && item.name.startsWith("@")) {
                                slots.push(item.name.slice(1));
                            }
                        }
                        validProps = ALLOWED_LAYOUT_PROPS.concat(slots);
                        type = "layout";
                    }
                    const props = (ref5 = node.parameters) == null ? void 0 : (ref6 = ref5[0]) == null ? void 0 : ref6.name;
                    if (props && ts.isObjectBindingPattern(props)) {
                        for (const prop of props.elements){
                            const propName = (prop.propertyName || prop.name).getText();
                            if (!validProps.includes(propName)) {
                                prior.push({
                                    file: source,
                                    category: ts.DiagnosticCategory.Error,
                                    code: NEXT_TS_ERRORS.INVALID_PAGE_PROP,
                                    messageText: `"${propName}" is not a valid ${type} prop.`,
                                    start: prop.getStart(),
                                    length: prop.getWidth()
                                });
                            }
                        }
                    }
                }
            });
            return prior;
        };
        return proxy;
    }
    return {
        create
    };
}

//# sourceMappingURL=next-typescript.js.map