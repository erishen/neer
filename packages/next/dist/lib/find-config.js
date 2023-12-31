"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findConfigPath = findConfigPath;
exports.findConfig = findConfig;
var _findUp = _interopRequireDefault(require("neer/dist/compiled/find-up"));
var _fs = _interopRequireDefault(require("fs"));
var _json5 = _interopRequireDefault(require("neer/dist/compiled/json5"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function findConfigPath(dir, key) {
    // If we didn't find the configuration in `package.json`, we should look for
    // known filenames.
    return (0, _findUp).default([
        `.${key}rc.json`,
        `${key}.config.json`,
        `.${key}rc.js`,
        `${key}.config.js`,
        `${key}.config.cjs`, 
    ], {
        cwd: dir
    });
}
async function findConfig(directory, key, _returnFile) {
    // `package.json` configuration always wins. Let's check that first.
    const packageJsonPath = await (0, _findUp).default("package.json", {
        cwd: directory
    });
    if (packageJsonPath) {
        const packageJson = require(packageJsonPath);
        if (packageJson[key] != null && typeof packageJson[key] === "object") {
            return packageJson[key];
        }
    }
    const filePath = await findConfigPath(directory, key);
    if (filePath) {
        if (filePath.endsWith(".js") || filePath.endsWith(".cjs")) {
            return require(filePath);
        }
        // We load JSON contents with JSON5 to allow users to comment in their
        // configuration file. This pattern was popularized by TypeScript.
        const fileContents = _fs.default.readFileSync(filePath, "utf8");
        return _json5.default.parse(fileContents);
    }
    return null;
}

//# sourceMappingURL=find-config.js.map