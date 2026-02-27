import { parse } from "parse5"
import { adapter } from "parse5-htmlparser2-tree-adapter"

import { convertHtmlToAst } from "./convertHtmlToAst.js"
import type { LintContentResult, ParsedElement, Warnings } from "./types.js"

/**
 * Lint HTML content for BEM methodology compliance
 *
 * @param {string} content - The content of the HTML file.
 * @returns {LintContentResult} The result of the BEM linting.
 */
export function lintContent (content: string): LintContentResult {
	let warnings: Warnings = { count: 0 }
	let htmlTree = parse(content, { treeAdapter: adapter }) as unknown as ParsedElement
	let ast = convertHtmlToAst(htmlTree, warnings)

	return {
		warningCount: warnings.count,
		ast,
	}
}
