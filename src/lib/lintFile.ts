import { readFile } from "node:fs/promises"

import { lintContent } from "./lintContent.ts"
import type { LintFileResult } from "./types.ts"

/**
 * Lint a single HTML file for BEM methodology compliance
 *
 * @param {string} filePath - Path to the HTML file.
 * @returns {Promise<LintFileResult>} Lint result or null if no issues found.
 */
export async function lintFile (filePath: string): Promise<LintFileResult> {
	let content: string

	try {
		content = await readFile(filePath, `utf8`)
	}
	catch (errorObj) {
		let readError = errorObj instanceof Error ? errorObj : new Error(String(errorObj))
		return { filePath, code: `file-read`, errorObj: readError }
	}

	let { warningCount, diagnostics, ast } = lintContent(content)
	if (!warningCount) return null

	return { filePath, warningCount, diagnostics, ast }
}
