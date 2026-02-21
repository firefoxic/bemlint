import { addClassesAsPrefixes } from "./addClassesAsPrefixes.js"
import { createLabel } from "./createLabel.js"
import { formatTree } from "./formatTree.js"

/**
 * Converts an HTML tree to an abstract syntax tree (AST).
 *
 * @param {HTMLElement} htmlTree - The HTML tree to be converted.
 * @param {object} warnings - The warnings object.
 * @returns {Object} The formatted AST.
 */
export function convertHtmlToAst (htmlTree, warnings) {
	let ast = { nodes: [], warningCount: 0 }

	for (let node of htmlTree.childNodes) {
		if (node.nodeType !== 1) continue

		ast.label = createLabel(node)
		addClassesAsPrefixes(node)
		formatTree(node.childNodes, ast.nodes, node.customDataSet?.prefixes, warnings)
	}

	return ast
}
