import { defineConfig } from "tsdown"

export default defineConfig({
	entry: {
		"bin/cli": `src/bin/cli.ts`,
		"lib/bemlint": `src/lib/bemlint.ts`,
	},
	deps: {
		neverBundle: [/package\.json$/],
	},
	fixedExtension: false,
	minify: true,
})
