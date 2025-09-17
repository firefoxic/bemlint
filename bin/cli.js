#!/usr/bin/env node

import { info } from "node:console"
import { argv, exit } from "node:process"

import { bemlint } from "../lib/index.js"

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

let patterns = []

for (let arg of argv.slice(2)) {
	if (arg === `--help` || arg === `-h`) {
		info(HELP_TEXT)
		exit(0)
	}

	if (arg === `--version` || arg === `-v`) {
		let { default: { version } } = await import(`../package.json`, { "with": { type: `json` } })

		info(version)
		exit(0)
	}

	patterns.push(arg)
}

await bemlint(patterns)
