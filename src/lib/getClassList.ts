import type { ParsedElement } from "./types.js"

/**
 * Helper function to get class list from element attributes.
 *
 * @param {ParsedElement} node - The node to get class list from.
 * @returns {string[]} The list of class names.
 */
export function getClassList (node: ParsedElement): string[] {
	let classValue = node.attribs?.class
	if (!classValue) return []
	return classValue.split(/\s+/).filter(Boolean)
}
