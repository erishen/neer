let chalk;
if (process.env.NEXT_RUNTIME === "edge") {
    chalk = require("./web/chalk").default;
} else {
    chalk = require("neer/dist/compiled/chalk");
}
export default chalk;

//# sourceMappingURL=chalk.js.map