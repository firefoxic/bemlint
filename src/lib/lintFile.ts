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
	try {
		let content = await readFile(filePath, `utf8`)
		let { warningCount, diagnostics, ast } = lintContent(content)

		if (!warningCount) return null

		return { filePath, warningCount, diagnostics, ast }
	}
	catch (errorObj) {
		return { filePath, errorObj: errorObj as Error }
	}
}
