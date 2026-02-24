import { error } from "node:console"
import { glob } from "node:fs/promises"
import { exit } from "node:process"

import { lintFile } from "../lintFile/index.js"
import { reportFileResult } from "../reportFileResult/index.js"
import { resolvePatterns } from "../resolvePatterns/index.js"

/**
 * Lint multiple HTML files for BEM methodology compliance
 *
 * @param {string[] | string} input - Input patterns (glob, file paths, or directories)
 * @returns {Promise<void>} Promise resolving when all files have been linted
 *
 * @throws Error if no input patterns are specified
 * @throws Error if no HTML files are found matching the specified patterns
 */
export async function bemlint (input: string[] | string): Promise<void> {
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

		let fileResults = await Promise.all(filePaths.map(async (filePath: string) => await lintFile(filePath)))

		for (let result of fileResults) {
			if (result) reportFileResult(result)
		}
	}
	catch (errorObj) {
		error(`Error processing files:`, (errorObj as Error).message)
		exit(1)
	}
}
