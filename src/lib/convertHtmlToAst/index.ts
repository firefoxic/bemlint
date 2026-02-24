import { addClassesAsPrefixes } from "../addClassesAsPrefixes/index.js"
import { createLabel } from "../createLabel/index.js"
import { formatTree } from "../formatTree/index.js"
import { hasClass } from "../hasClass/index.js"
import type { AstNode, ParsedElement, Warnings } from "../types.js"

/**
 * Converts an HTML tree to an abstract syntax tree (AST).
 *
 * @param {ParsedElement} htmlTree - The HTML tree to be converted.
 * @param {Warnings} warnings - The warnings object.
 * @returns {AstNode} The formatted AST.
 */
export function convertHtmlToAst (htmlTree: ParsedElement, warnings: Warnings): AstNode {
	let ast: AstNode = { nodes: [] }

	for (let node of htmlTree.childNodes) {
		if (!node.tagName) continue

		ast.label = createLabel(node)
		if (hasClass(node)) addClassesAsPrefixes(node)
		formatTree(node.childNodes, ast.nodes, node.customDataSet?.prefixes, warnings)
	}

	return ast
}
