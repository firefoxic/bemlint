#!/usr/bin/env node

import { createRequire } from "node:module"
import process from "node:process"

import { bemlint } from "../lib/bemlint.ts"
import { reportFileResult } from "../lib/reportFileResult.ts"

const HELP_TEXT = `
    CLI tool for HTML linting using BEM methodology.

    Usage
        $ bemlint <input>

    Options
        -h, --help     Show help
        -v, --version  Show version
        -f, --format   Output format: text (default) or json

    Examples
        $ bemlint index.html
        $ bemlint "src/**/*.html"
        $ bemlint "dist/**/*.html" "build/**/*.html"
        $ bemlint --format json "src/**/*.html"

    Exit codes
        0  No BEM issues found
        1  BEM issues found
`

const patterns: string[] = []
let outputFormat = `text`

let args = process.argv.slice(2)
for (let index = 0; index < args.length; index += 1) {
	let arg = args[index]

	if (arg === `--help` || arg === `-h`) {
		// oxlint-disable-next-line no-console
		console.info(HELP_TEXT)
		process.exit(0)
	}

	if (arg === `--version` || arg === `-v`) {
		// oxlint-disable-next-line no-console
		console.info(getVersion())
		process.exit(0)
	}

	if (arg === `--format` || arg === `-f`) {
		outputFormat = args[index + 1] ?? ``
		index += 1
		continue
	}

	patterns.push(arg)
}

try {
	if (outputFormat !== `text` && outputFormat !== `json`) {
		throw new Error(`Unknown output format "${outputFormat}". Available formats: text, json`)
	}

	let result = await bemlint(patterns)

	if (result.results.length > 0) {
		process.exitCode = 1
	}

	if (outputFormat === `json`) {
		let output = {
			checkedFileCount: result.checkedFileCount,
			results: result.results.map((fileResult) => {
				if (`errorObj` in fileResult) {
					return {
						filePath: fileResult.filePath,
						error: {
							name: fileResult.errorObj.name,
							message: fileResult.errorObj.message,
						},
					}
				}

				return {
					filePath: fileResult.filePath,
					warningCount: fileResult.warningCount,
					diagnostics: fileResult.diagnostics,
				}
			}),
		}

		// oxlint-disable-next-line no-console
		console.info(JSON.stringify(output))
	}
	else if (result.results.length > 0) {
		process.env.FORCE_COLOR = `2`
		for (let fileResult of result.results) reportFileResult(fileResult)
	}
}
catch (errorObj) {
	let error = errorObj instanceof Error ? errorObj : new Error(String(errorObj))

	if (outputFormat === `json`) {
		// oxlint-disable-next-line no-console
		console.info(JSON.stringify({ error: { name: error.name, message: error.message } }))
	}
	else {
		// oxlint-disable-next-line no-console
		console.error(`Error: ${error.message}\nRun \`bemlint --help\` for usage information`)
	}

	process.exit(1)
}

/**
 * Gets the current bemlint version from package.json.
 * @returns {string} The package version.
 */
function getVersion (): string {
	let require = createRequire(import.meta.url)
	let pkg = require(`../../package.json`) as { version: string }
	return pkg.version
}
