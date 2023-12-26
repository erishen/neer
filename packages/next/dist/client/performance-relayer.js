"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
// copied to prevent pulling in un-necessary utils
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
const initialHref = location.href;
let isRegistered = false;
let userReportHandler;
function onReport(metric) {
    if (userReportHandler) {
        userReportHandler(metric);
    }
    // This code is not shipped, executed, or present in the client-side
    // JavaScript bundle unless explicitly enabled in your application.
    //
    // When this feature is enabled, we'll make it very clear by printing a
    // message during the build (`next build`).
    if (process.env.NODE_ENV === 'production' && // This field is empty unless you explicitly configure it:
    process.env.__NEXT_ANALYTICS_ID) {
        var ref;
        const body = {
            dsn: process.env.__NEXT_ANALYTICS_ID,
            id: metric.id,
            page: (ref = window.__NEXT_DATA__) == null ? void 0 : ref.page,
            href: initialHref,
            event_name: metric.name,
            value: metric.value.toString(),
            speed: 'connection' in navigator && navigator['connection'] && 'effectiveType' in navigator['connection'] ? navigator['connection']['effectiveType'] : ''
        };
        const blob = new Blob([
            new URLSearchParams(body).toString()
        ], {
            // This content type is necessary for `sendBeacon`:
            type: 'application/x-www-form-urlencoded'
        });
        const vitalsUrl = 'https://vitals.vercel-insights.com/v1/vitals';
        // Navigator has to be bound to ensure it does not error in some browsers
        // https://xgwang.me/posts/you-may-not-know-beacon/#it-may-throw-error%2C-be-sure-to-catch
        const send = navigator.sendBeacon && navigator.sendBeacon.bind(navigator);
        function fallbackSend() {
            fetch(vitalsUrl, {
                body: blob,
                method: 'POST',
                credentials: 'omit',
                keepalive: true
            }).catch(console.error);
        }
        try {
            // If send is undefined it'll throw as well. This reduces output code size.
            send(vitalsUrl, blob) || fallbackSend();
        } catch (err) {
            fallbackSend();
        }
    }
}
var _default = (onPerfEntry)=>{
    // Update function if it changes:
    userReportHandler = onPerfEntry;
    // Only register listeners once:
    if (isRegistered) {
        return;
    }
    isRegistered = true;
    const attributions = process.env.__NEXT_WEB_VITALS_ATTRIBUTION;
    for (const webVital of WEB_VITALS){
        try {
            let mod;
            if (process.env.__NEXT_HAS_WEB_VITALS_ATTRIBUTION) {
                if (attributions == null ? void 0 : attributions.includes(webVital)) {
                    mod = require('neer/dist/compiled/web-vitals-attribution');
                }
            }
            if (!mod) {
                mod = require('neer/dist/compiled/web-vitals');
            }
            mod[`on${webVital}`](onReport);
        } catch (err) {
            // Do nothing if the module fails to load
            console.warn(`Failed to track ${webVital} web-vital`, err);
        }
    }
};
exports.default = _default;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=performance-relayer.js.map