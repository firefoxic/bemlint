import type { ParsedElement } from "./types.js"

/**
 * Helper function to get id from element attributes.
 *
 * @param {ParsedElement} node - The node to get id from.
 * @returns {string} The id value or an empty string if not found.
 */
export function getId (node: ParsedElement): string {
	return node.attribs?.id || ``
}
