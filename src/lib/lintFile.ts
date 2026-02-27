import { readFile } from "node:fs/promises"

import { lintContent } from "./lintContent.js"
import type { FileLintResult } from "./types.js"

/**
 * Lint a single HTML file for BEM methodology compliance
 *
 * @param {string} filePath - Path to the HTML file.
 * @returns {Promise<FileLintResult>} Lint result or null if no issues found.
 */
export async function lintFile (filePath: string): Promise<FileLintResult> {
	try {
		let content = await readFile(filePath, `utf8`)
		let { warningCount, ast } = lintContent(content)

		if (!warningCount) return null

		return { filePath, warningCount, ast }
	}
	catch (errorObj) {
		return { filePath, errorObj: errorObj as Error }
	}
}
