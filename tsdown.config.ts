import { defineConfig } from "tsdown"

export default defineConfig({
	entry: {
		"bin/cli": `src/bin/cli.ts`,
		"lib/bemlint": `src/lib/bemlint.ts`,
	},
	fixedExtension: false,
	minify: true,
})
