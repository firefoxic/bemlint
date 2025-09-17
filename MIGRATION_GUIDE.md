# Migration guide

This guide will help you migrate from the `gulp-html-bemlinter` plugin to the new `bemlint` CLI tool (v6.0.0).

## What Changed

- **Package name** — `gulp-html-bemlinter` → `bemlint`
- **Type** — Gulp plugin → Standalone CLI tool
- **Dependencies** — No longer requires Gulp
- **Usage** — Stream-based → File system-based
- **Node.js requirement** — Requires Node.js 22.18+

## Benefits of Migration

1. **No Gulp dependency** — Works in any Node.js environment
2. **Better performance** — Direct file system access
3. **Simpler setup** — No build system required
4. **Standalone tool** — Can be used independently
5. **Better CLI experience** — Native CLI with proper exit codes

## Migration steps

- [ ] Remove gulp plugin from dependencies:

	````shell
	pnpm rm -D gulp-html-bemlinter
	````

- [ ] Remove `gulp` or `vinyl-fs` dependency (if no longer needed):

	````shell
	pnpm rm -D gulp # or vinyl-fs
	````

- [ ] Install CLI tool:

	```shell
	pnpm add -D @firefoxic/bemlint
	```

- [ ] Delete gulp plugin usage from your codebase:

	```diff
	import { src } from "gulp"
	-import bemlinter from "gulp-html-bemlinter"

	-export function lintBemMarkup() {
	-	return src("dist/**/*.html")
	-		.pipe(bemlinter())
	-}
	```

- [ ] Edit package.json script:

	```diff
	{
		"scripts": {
	-		"lint:bem": "gulp lintBemMarkup"
	+		"lint:bem": "bemlint dist"
		}
	}
	```

- [ ] Update CI/CD pipelines (unnecessary if using package.json scripts):

	```diff
	- name: Run BEM linting
	run: |
	    pnpm i
	    pnpm build
	-    pnpm exec gulp lintBemMarkup
	+    pnpm exec @firefoxic/bemlint dist
	```

- [ ] Test with existing HTML files.
- [ ] Optionally update documentation and README.

## Support

If you encounter issues during migration:

1. Check the [README.md](README.md) for updated usage examples
2. Review your file patterns and paths
3. Ensure Node.js version compatibility (22.18+)
4. Test with a single file first before using glob patterns

The core BEM linting logic remains the same, so you should get identical results with the new CLI tool.
