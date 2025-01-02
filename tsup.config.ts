import { defineConfig } from "tsup";

const config = defineConfig({
	entry: ["src/index.{ts,tsx}"],
	target: "node16.20",
	format: "esm",
	outDir: "build",
	// minify: true,
	shims: true,
	banner: {
		js: `
      import { createRequire as _createRequire } from 'node:module';
      const require = _createRequire(import.meta.url);
    `,
	},
	external: ["react-devtools-core", "yoga-wasm-web"],
});

export default config;
