import { HTMLElement } from "node-html-parser"

import { addClassesAsPrefixes } from "../addClassesAsPrefixes/index.js"
import { createLabel } from "../createLabel/index.js"
import { formatTree } from "../formatTree/index.js"
import type { AstNode, Warnings } from "../types.js"

/**
 * Converts an HTML tree to an abstract syntax tree (AST).
 *
 * @param {HTMLElement} htmlTree - The HTML tree to be converted.
 * @param {Warnings} warnings - The warnings object.
 * @returns {AstNode} The formatted AST.
 */
export function convertHtmlToAst (htmlTree: HTMLElement, warnings: Warnings): AstNode {
	let ast: AstNode = { nodes: [] }

	for (let node of htmlTree.childNodes) {
		if (!(node instanceof HTMLElement) || node.nodeType !== 1) continue

		ast.label = createLabel(node)
		addClassesAsPrefixes(node)
		formatTree(node.childNodes, ast.nodes, node.customDataSet?.prefixes, warnings)
	}

	return ast
}
