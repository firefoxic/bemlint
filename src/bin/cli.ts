#!/usr/bin/env node

import { createRequire } from "node:module"
import process from "node:process"

import { bemlint } from "../lib/bemlint.js"

const HELP_TEXT = `
    CLI tool for HTML linting using BEM methodology.

    Usage
        $ bemlint <input>

    Options
        -h, --help     Show help
        -v, --version  Show version

    Examples
        $ bemlint index.html
        $ bemlint "src/**/*.html"
        $ bemlint "dist/**/*.html" "build/**/*.html"

    Exit codes
        0  No BEM issues found
        1  BEM issues found
`

const patterns: string[] = []

for (let arg of process.argv.slice(2)) {
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

	patterns.push(arg)
}

try {
	await bemlint(patterns)
}
catch (errorObj) {
	// oxlint-disable-next-line no-console
	console.error(`Error: ${(errorObj as Error).message}\nRun \`bemlint --help\` for usage information`)
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
