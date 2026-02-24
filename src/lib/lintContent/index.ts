import htmlParser from "node-html-parser"

import { convertHtmlToAst } from "../convertHtmlToAst/index.js"
import type { LintContentResult, Warnings } from "../types.js"

/**
 * Lint HTML content for BEM methodology compliance
 *
 * @param {string} content - The content of the HTML file.
 * @returns {LintContentResult} The result of the BEM linting.
 */
export function lintContent (content: string): LintContentResult {
	let warnings: Warnings = { count: 0 }
	let htmlTree = htmlParser.parse(content)
	let ast = convertHtmlToAst(htmlTree, warnings)

	return {
		warningCount: warnings.count,
		ast,
	}
}
