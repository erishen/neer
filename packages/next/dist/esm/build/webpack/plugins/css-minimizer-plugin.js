import cssnanoSimple from "neer/dist/compiled/cssnano-simple";
import postcssScss from "neer/dist/compiled/postcss-scss";
import postcss from "postcss";
import { webpack, sources } from "neer/dist/compiled/webpack/webpack";
import { spans } from "./profiling-plugin";
// https://github.com/NMFR/optimize-css-assets-webpack-plugin/blob/0a410a9bf28c7b0e81a3470a13748e68ca2f50aa/src/index.js#L20
const CSS_REGEX = /\.css(\?.*)?$/i;
export class CssMinimizerPlugin {
    __next_css_remove = true;
    constructor(options){
        this.options = options;
    }
    optimizeAsset(file, asset) {
        const postcssOptions = {
            ...this.options.postcssOptions,
            to: file,
            from: file,
            // We don't actually add this parser to support Sass. It can also be used
            // for inline comment support. See the README:
            // https://github.com/postcss/postcss-scss/blob/master/README.md#2-inline-comments-for-postcss
            parser: postcssScss
        };
        let input;
        if (postcssOptions.map && asset.sourceAndMap) {
            const { source , map  } = asset.sourceAndMap();
            input = source;
            postcssOptions.map.prev = map ? map : false;
        } else {
            input = asset.source();
        }
        return postcss([
            cssnanoSimple({}, postcss)
        ]).process(input, postcssOptions).then((res)=>{
            if (res.map) {
                return new sources.SourceMapSource(res.css, file, res.map.toJSON());
            } else {
                return new sources.RawSource(res.css);
            }
        });
    }
    apply(compiler) {
        compiler.hooks.compilation.tap("CssMinimizerPlugin", (compilation)=>{
            const cache = compilation.getCache("CssMinimizerPlugin");
            compilation.hooks.processAssets.tapPromise({
                name: "CssMinimizerPlugin",
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE
            }, async (assets)=>{
                const compilationSpan = spans.get(compilation) || spans.get(compiler);
                const cssMinimizerSpan = compilationSpan.traceChild("css-minimizer-plugin");
                cssMinimizerSpan.setAttribute("webpackVersion", 5);
                return cssMinimizerSpan.traceAsyncFn(async ()=>{
                    const files = Object.keys(assets);
                    await Promise.all(files.filter((file)=>CSS_REGEX.test(file)).map(async (file)=>{
                        const assetSpan = cssMinimizerSpan.traceChild("minify-css");
                        assetSpan.setAttribute("file", file);
                        return assetSpan.traceAsyncFn(async ()=>{
                            const asset = assets[file];
                            const etag = cache.getLazyHashedEtag(asset);
                            const cachedResult = await cache.getPromise(file, etag);
                            assetSpan.setAttribute("cache", cachedResult ? "HIT" : "MISS");
                            if (cachedResult) {
                                assets[file] = cachedResult;
                                return;
                            }
                            const result = await this.optimizeAsset(file, asset);
                            await cache.storePromise(file, etag, result);
                            assets[file] = result;
                        });
                    }));
                });
            });
        });
    }
}

//# sourceMappingURL=css-minimizer-plugin.js.map