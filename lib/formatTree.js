import { addClassesAsPrefixes } from "./addClassesAsPrefixes.js"
import { checkBemElement } from "./checkBemElement.js"
import { checkBemModifier } from "./checkBemModifier.js"
import { checkSeparators } from "./checkSeparators.js"
import { createLabel } from "./createLabel.js"

/**
 * Formats the tree of HTML nodes and generates an abstract syntax tree (AST) based on the given HTML nodes.
 *
 * @param {Array} htmlNodes - An array of HTML nodes.
 * @param {Array} astNodes - An array to store the generated AST nodes.
 * @param {Set} prefixes - A set of prefixes.
 * @param {object} warnings - The warnings object.
 */
export function formatTree (htmlNodes, astNodes, prefixes = new Set(), warnings) {
	for (let node of htmlNodes) {
		if (node.nodeType !== 1) continue

		node.customDataSet = { prefixes }

		addClassesAsPrefixes(node)
		checkSeparators(node, warnings)
		checkBemElement(node, warnings)
		checkBemModifier(node, warnings)

		let ast = {
			label: createLabel(node),
			nodes: [],
		}

		astNodes.push(ast)

		if (node.childNodes.length > 0) {
			formatTree(node.childNodes, ast.nodes, node.customDataSet.prefixes, warnings)
		}
	}
}
