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

	let patterns = await resolvePatterns(input)

	try {
		let filePaths = await Array.fromAsync(glob(patterns, { exclude: [`**/node_modules/**/*`] }))

		if (filePaths.length === 0) {
			error(`Error: No HTML files found matching the specified patterns`)
			exit(1)
		}

		let fileResults = await Promise.all(filePaths.map((filePath) => lintFile(filePath)))

		for (let result of fileResults) {
			if (result) reportFileResult(result)
		}
	}
	catch (errorObj) {
		error(`Error processing files:`, errorObj.message)
		exit(1)
	}
}

/**
 * Normalize input patterns, converting directories to glob patterns
 *
 * @param {string[]|string} input - Input patterns (glob, file paths, or directories)
 *
 * @returns {Promise<string[]>} Normalized glob patterns
 */
function resolvePatterns (input) {
	let inputs = typeof input === `string` ? [input] : input

	return Promise.all(
		inputs.map(async (inputItem) => {
			let stats = await stat(inputItem).catch(() => null)
			return stats?.isDirectory() ? `${inputItem.replace(/\/+$/, ``)}/**/*.html` : inputItem
		}),
	)
}

/**
 * Lint a single HTML file for BEM methodology compliance
 *
 * @param {string} filePath - Path to the HTML file.
 *
 * @returns {Promise<{filePath: string, warningCount: number, ast: object}|{filePath: string, errorObj: Error}|null>} Lint result or null if no issues found.
 */
async function lintFile (filePath) {
	try {
		let content = await readFile(filePath, `utf8`)
		let { warningCount, ast } = lintContent(content)

		if (!warningCount) return null

		return { filePath, warningCount, ast }
	}
	catch (errorObj) {
		return { filePath, errorObj }
	}
}

/**
 * Output lint results for a single file
 *
 * @param {{filePath: string, warningCount: number, ast: object}|{filePath: string, errorObj: Error}} result - Lint result
 *
 * @returns {void}
 */
function reportFileResult (result) {
	process.exitCode = 1
	process.env.FORCE_COLOR = 2

	let { filePath, warningCount, ast, errorObj } = result

	if (errorObj) {
		error(`Error reading file ${filePath}:`, errorObj.message)
		return
	}

	error(`\n`, generateAsciiTree(ast), styleText([`red`], `\n\nFile: ${filePath}\nbemlint: ${warningCount} issue${warningCount > 1 ? `s` : ``} found!\n`))
}
