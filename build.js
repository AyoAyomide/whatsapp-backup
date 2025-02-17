const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["node_modules/alpinejs/dist/cdn.no-eval.js"], // Directly bundle Alpine
    bundle: true,
    outfile: "dist/alpine.js", // The final built file
    minify: true,
    format: "esm", // Keep it as an ES module
    target: "esnext", // Target modern browsers
}).catch(() => process.exit(1));
