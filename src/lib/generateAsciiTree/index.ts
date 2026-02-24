import type { AsciiTreeOptions, AstNode } from "../types.js"

/**
 * Generates an ASCII tree representation of the given abstract syntax tree (AST).
 *
 * @param {AstNode} ast - The abstract syntax tree.
 * @param {AsciiTreeOptions} options - The options for generating the ASCII tree.
 * @param {string} options.prefix - The prefix string to be added to each node in the tree.
 * @param {string} options.suffix - The suffix string to be added between nodes in the tree.
 * @param {string} options.postfix - The postfix string to be added to each node in the tree.
 * @returns {string} The ASCII tree representation of the AST.
 */
export function generateAsciiTree (
	ast: AstNode,
	{ prefix = ``, suffix = ``, postfix = `` }: AsciiTreeOptions = {},
): string {
	let { label = ``, nodes } = ast
	let asciiTree = `${prefix}${postfix}${label}`

	if (!nodes) return asciiTree

	for (let [index, node] of nodes.entries()) {
		let isLastNode = index === nodes.length - 1

		asciiTree += `\n`
		asciiTree += generateAsciiTree(node, {
			prefix: prefix + suffix,
			suffix: isLastNode ? `   ` : `│  `,
			postfix: isLastNode ? `└─ ` : `├─ `,
		})
	}

	return asciiTree
}
