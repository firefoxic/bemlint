import htmlParser from "node-html-parser"

import { convertHtmlToAst } from "./convertHtmlToAst.js"

/**
 * Lint HTML content for BEM methodology compliance
 *
 * @param {string} content - The content of the HTML file.
 *
 * @typedef {Object} LintContentResult
 * @property {number} warningCount - The amount of BEM issues found.
 * @property {Object} ast - The abstract syntax tree of the parsed HTML.
 *
 * @returns {LintContentResult} - The result of the BEM linting.
 */
export function lintContent (content) {
	let warnings = { count: 0 }
	let htmlThree = htmlParser.parse(content)
	let ast = convertHtmlToAst(htmlThree, warnings)

	return {
		warningCount: warnings.count,
		ast,
	}
}
