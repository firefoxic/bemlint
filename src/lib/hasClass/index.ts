import type { ParsedElement } from "../types.js"

/**
 * Helper function to check if node has class attribute.
 *
 * @param {ParsedElement} node - The HTML node to check.
 * @returns {boolean} True if the node has a class attribute, false otherwise.
 */
export function hasClass (node: ParsedElement): boolean {
	return !!node.attribs?.class
}
