import { ReadableStream, TransformStream } from "neer/dist/compiled/@edge-runtime/primitives/streams";
// Polyfill Web Streams for the Node.js runtime.
if (!global.ReadableStream) {
    global.ReadableStream = ReadableStream;
}
if (!global.TransformStream) {
    global.TransformStream = TransformStream;
}

//# sourceMappingURL=node-polyfill-web-streams.js.map