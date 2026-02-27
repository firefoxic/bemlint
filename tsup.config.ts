import { defineConfig } from "tsup"

export default defineConfig({
	entry: {
		"bin/cli": `src/bin/cli.ts`,
		"lib/bemlint": `src/lib/bemlint.ts`,
	},
	external: [/package\.json$/],
	format: [`esm`],
	target: `esnext`,
	minify: true,
	dts: true,
	clean: true,
})
