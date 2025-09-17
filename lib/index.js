import { error } from "node:console"
import { glob, readFile, stat } from "node:fs/promises"
import process, { exit } from "node:process"
import { styleText } from "node:util"

import { generateAsciiTree } from "./generateAsciiTree.js"
import { lintContent } from "./lintContent.js"

/**
 * Lint multiple HTML files for BEM methodology compliance
 *
 * @param {string[]|string} input - Input patterns (glob, file paths, or directories)
 *
 * @returns {Promise<void>} Promise resolving when all files have been linted
 *
 * @throws {Error} If no input patterns are specified
 * @throws {Error} If no HTML files are found matching the specified patterns
 */
export async function bemlint (input) {
	if (input.length === 0) {
		error(`Error: No input patterns specified`)
		error(`Run \`bemlint --help\` for usage information`)
		exit(1)
	}

	let inputs = typeof input === `string` ? [input] : input
	let patterns = await Array.fromAsync((async function *() {
		for (let inputItem of inputs) {
			let stats = await stat(inputItem).catch(() => null)

			yield stats?.isDirectory() ? `${inputItem.replace(/\/+$/, ``)}/**/*.html` : inputItem
		}
	}()))

	try {
		let filePaths = await Array.fromAsync(glob(patterns, { exclude: [`**/node_modules/**/*`] }))

		if (filePaths.length === 0) {
			error(`Error: No HTML files found matching the specified patterns`)
			exit(1)
		}

		for (let filePath of filePaths) {
			try {
				let content = await readFile(filePath, `utf8`)
				let { warningCount, ast } = lintContent(content)

				if (!warningCount) continue

				process.exitCode = 1
				process.env.FORCE_COLOR = true
				console.error(`\n`, generateAsciiTree(ast), styleText([`red`], `\n\nFile: ${filePath}\nbemlint: ${warningCount} issue${warningCount > 1 ? `s` : ``} found!\n`))
			} catch (errorObj) {
				error(`Error reading file ${filePath}:`, errorObj.message)
				process.exitCode = 1
				continue
			}
		}
	} catch (errorObj) {
		error(`Error processing files:`, errorObj.message)
		exit(1)
	}
}
