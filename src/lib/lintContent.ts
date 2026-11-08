import { parse } from "parse5"
import { adapter } from "parse5-htmlparser2-tree-adapter"

import { convertHtmlToAst } from "./convertHtmlToAst.ts"
import type { LintContentResult, LintDiagnostic, ParsedElement, Warnings } from "./types.ts"

/**
 * Lint HTML content for BEM methodology compliance
 *
 * @param {string} content - The content of the HTML file.
 * @returns {LintContentResult} The result of the BEM linting.
 */
export function lintContent (content: string): LintContentResult {
	let diagnostics: LintDiagnostic[] = []
	let warnings: Warnings = { count: 0, diagnostics }
	let htmlTree = parse(content, { treeAdapter: adapter, sourceCodeLocationInfo: true }) as unknown as ParsedElement
	let ast = convertHtmlToAst(htmlTree, warnings)

	return {
		warningCount: warnings.count,
		diagnostics,
		ast,
	}
}
