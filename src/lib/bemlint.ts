import { glob } from "node:fs/promises"

import { lintFile } from "./lintFile.ts"
import { resolvePatterns } from "./resolvePatterns.ts"
import type { BemlintResult, FileLintResult } from "./types.ts"

export type { BemlintResult } from "./types.ts"

/**
 * Lint multiple HTML files for BEM methodology compliance
 *
 * @param {string[] | string} input - Input patterns (glob, file paths, or directories)
 * @returns {Promise<BemlintResult>} The number of checked files and results for files with issues or errors
 *
 * @throws {Error} Error if no input patterns are specified
 * @throws {Error} Error if no HTML files are found matching the specified patterns
 */
export async function bemlint (input: string[] | string): Promise<BemlintResult> {
	if (input.length === 0) throw new Error(`No input patterns specified`)

	let patterns = await resolvePatterns(input)
	let filePaths = await Array.fromAsync(glob(patterns, { exclude: [`**/node_modules/**/*`] }))

	if (filePaths.length === 0) throw new Error(`No HTML files found matching the specified patterns`)

	let fileResults = await Promise.all(filePaths.map(async (filePath: string) => await lintFile(filePath)))
	let results = fileResults.filter((result): result is FileLintResult => result !== null)

	return { checkedFileCount: filePaths.length, results }
}
