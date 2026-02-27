import { glob } from "node:fs/promises"

import { lintFile } from "./lintFile.js"
import { reportFileResult } from "./reportFileResult.js"
import { resolvePatterns } from "./resolvePatterns.js"

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
	if (input.length === 0) throw new Error(`No input patterns specified`)

	let patterns = await resolvePatterns(input)
	let filePaths = await Array.fromAsync(glob(patterns, { exclude: [`**/node_modules/**/*`] }))

	if (filePaths.length === 0) throw new Error(`No HTML files found matching the specified patterns`)

	let fileResults = await Promise.all(filePaths.map(async (filePath: string) => await lintFile(filePath)))

	for (let result of fileResults) if (result) reportFileResult(result)
}
