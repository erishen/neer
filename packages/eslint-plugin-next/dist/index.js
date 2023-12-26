"use strict";
module.exports = {
    rules: {
        "google-font-display": require("./rules/google-font-display"),
        "google-font-preconnect": require("./rules/google-font-preconnect"),
        "inline-script-id": require("./rules/inline-script-id"),
        "next-script-for-ga": require("./rules/next-script-for-ga"),
        "no-assign-module-variable": require("./rules/no-assign-module-variable"),
        "no-before-interactive-script-outside-document": require("./rules/no-before-interactive-script-outside-document"),
        "no-css-tags": require("./rules/no-css-tags"),
        "no-document-import-in-page": require("./rules/no-document-import-in-page"),
        "no-duplicate-head": require("./rules/no-duplicate-head"),
        "no-head-element": require("./rules/no-head-element"),
        "no-head-import-in-document": require("./rules/no-head-import-in-document"),
        "no-html-link-for-pages": require("./rules/no-html-link-for-pages"),
        "no-img-element": require("./rules/no-img-element"),
        "no-page-custom-font": require("./rules/no-page-custom-font"),
        "no-script-component-in-head": require("./rules/no-script-component-in-head"),
        "no-styled-jsx-in-document": require("./rules/no-styled-jsx-in-document"),
        "no-sync-scripts": require("./rules/no-sync-scripts"),
        "no-title-in-document-head": require("./rules/no-title-in-document-head"),
        "no-typos": require("./rules/no-typos"),
        "no-unwanted-polyfillio": require("./rules/no-unwanted-polyfillio")
    },
    configs: {
        recommended: {
            plugins: [
                "neer"
            ],
            rules: {
                // warnings
                "neer/google-font-display": "warn",
                "neer/google-font-preconnect": "warn",
                "neer/next-script-for-ga": "warn",
                "neer/no-before-interactive-script-outside-document": "warn",
                "neer/no-css-tags": "warn",
                "neer/no-head-element": "warn",
                "neer/no-html-link-for-pages": "warn",
                "neer/no-img-element": "warn",
                "neer/no-page-custom-font": "warn",
                "neer/no-styled-jsx-in-document": "warn",
                "neer/no-sync-scripts": "warn",
                "neer/no-title-in-document-head": "warn",
                "neer/no-typos": "warn",
                "neer/no-unwanted-polyfillio": "warn",
                // errors
                "neer/inline-script-id": "error",
                "neer/no-assign-module-variable": "error",
                "neer/no-document-import-in-page": "error",
                "neer/no-duplicate-head": "error",
                "neer/no-head-import-in-document": "error",
                "neer/no-script-component-in-head": "error"
            }
        },
        "core-web-vitals": {
            plugins: [
                "neer"
            ],
            extends: [
                "plugin:neer/recommended"
            ],
            rules: {
                "neer/no-html-link-for-pages": "error",
                "neer/no-sync-scripts": "error"
            }
        }
    }
};
