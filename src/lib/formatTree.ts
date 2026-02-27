import { addClassesAsPrefixes } from "./addClassesAsPrefixes.js"
import { checkBemElement } from "./checkBemElement.js"
import { checkBemModifier } from "./checkBemModifier.js"
import { checkSeparators } from "./checkSeparators.js"
import { createLabel } from "./createLabel.js"
import { hasClass } from "./hasClass.js"
import type { AstNode, ParsedElement, Warnings } from "./types.js"

/**
 * Formats the tree of HTML nodes and generates an abstract syntax tree (AST) based on the given HTML nodes.
 *
 * @param {ParsedElement[]} htmlNodes - An array of HTML nodes.
 * @param {AstNode[]} astNodes - An array to store the generated AST nodes.
 * @param {Set<string>} prefixes - A set of prefixes.
 * @param {Warnings} warnings - The warnings object.
 */
export function formatTree (
	htmlNodes: ParsedElement[],
	astNodes: AstNode[],
	prefixes: Set<string> = new Set(),
	warnings: Warnings,
): void {
	for (let node of htmlNodes) {
		if (!node.tagName) continue

		node.customDataSet = { prefixes: new Set(prefixes) }

		if (hasClass(node)) {
			addClassesAsPrefixes(node)
			checkSeparators(node, warnings)
			checkBemElement(node, warnings)
			checkBemModifier(node, warnings)
		}

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
