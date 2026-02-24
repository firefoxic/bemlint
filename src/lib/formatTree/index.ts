import { HTMLElement, Node } from "node-html-parser"

import { addClassesAsPrefixes } from "../addClassesAsPrefixes/index.js"
import { checkBemElement } from "../checkBemElement/index.js"
import { checkBemModifier } from "../checkBemModifier/index.js"
import { checkSeparators } from "../checkSeparators/index.js"
import { createLabel } from "../createLabel/index.js"
import type { AstNode, Warnings } from "../types.js"

/**
 * Formats the tree of HTML nodes and generates an abstract syntax tree (AST) based on the given HTML nodes.
 *
 * @param {Node[]} htmlNodes - An array of HTML nodes.
 * @param {AstNode[]} astNodes - An array to store the generated AST nodes.
 * @param {Set<string>} prefixes - A set of prefixes.
 * @param {Warnings} warnings - The warnings object.
 */
export function formatTree (
	htmlNodes: Node[],
	astNodes: AstNode[],
	prefixes: Set<string> = new Set(),
	warnings: Warnings,
): void {
	for (let node of htmlNodes) {
		if (!(node instanceof HTMLElement) || node.nodeType !== 1) continue

		node.customDataSet = { prefixes: new Set(prefixes) }

		addClassesAsPrefixes(node)
		checkSeparators(node, warnings)
		checkBemElement(node, warnings)
		checkBemModifier(node, warnings)

		let ast: AstNode = {
			label: createLabel(node),
			nodes: [],
		}

		astNodes.push(ast)

		if (node.childNodes.length > 0) {
			formatTree(node.childNodes, ast.nodes, node.customDataSet.prefixes, warnings)
		}
	}
}
