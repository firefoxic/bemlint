#!/usr/bin/env node

import process from "node:process"

import { bemlint } from "../lib/bemlint/index.js"

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
		// oxlint-disable-next-line no-await-in-loop
		let { default: { version } } = await import(`../../package.json`, { "with": { type: `json` } })

		// oxlint-disable-next-line no-console
		console.info(version)
		process.exit(0)
	}

	patterns.push(arg)
}

await bemlint(patterns)
