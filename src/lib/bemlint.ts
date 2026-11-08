import { glob } from "node:fs/promises"

import { BemlintError } from "./bemlintError.ts"
import { lintFile } from "./lintFile.ts"
import { processInBatches } from "./processInBatches.ts"
import { resolvePatterns } from "./resolvePatterns.ts"
import type { BemlintResult, FileLintResult } from "./types.ts"

const MAX_CONCURRENT_FILES = 8

/**
 * Lint multiple HTML files for BEM methodology compliance
 *
 * @param {string[] | string} input - Input patterns (glob, file paths, or directories)
 * @returns {Promise<BemlintResult>} The number of checked files and results for files with issues or errors
 *
 * @throws {BemlintError} Error if input patterns are missing, inaccessible, or match no HTML files
 */
export async function bemlint (input: string[] | string): Promise<BemlintResult> {
	if (input.length === 0) throw new BemlintError(`no-input-patterns`, `No input patterns specified`)

	let patterns = await resolvePatterns(input)
	let results: FileLintResult[] = []

	async function processBatch (filePaths: string[]): Promise<void> {
		let fileResults = await Promise.all(filePaths.map((filePath) => lintFile(filePath)))
		for (let fileResult of fileResults) if (fileResult) results.push(fileResult)
	}

	let checkedFileCount = await processInBatches(
		glob(patterns, { exclude: [`**/node_modules/**/*`] }),
		MAX_CONCURRENT_FILES,
		processBatch,
	)

	if (checkedFileCount === 0) throw new BemlintError(`no-html-files`, `No HTML files found matching the specified patterns`)

	return { checkedFileCount, results }
}

export type { BemlintErrorCode } from "./bemlintError.ts"
export { BemlintError } from "./bemlintError.ts"
export type { BemlintResult } from "./types.ts"
