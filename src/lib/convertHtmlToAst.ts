import { addClassesAsPrefixes } from "./addClassesAsPrefixes.ts"
import { createLabel } from "./createLabel.ts"
import { formatTree } from "./formatTree.ts"
import { hasClass } from "./hasClass.ts"
import type { AstNode, ParsedElement, Warnings } from "./types.ts"

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
		formatTree(node.childNodes, ast.nodes, warnings, node.customDataSet?.prefixes)
	}

	return ast
}
