import _typeof from "neer/dist/compiled/@babel/runtime/helpers/typeof";
import assertThisInitialized from "./assertThisInitialized.js";
export default function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return assertThisInitialized(self);
}