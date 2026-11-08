import { SEPARATORS } from "./constants.ts"
import type { BemClassNameResult, BemClassParts } from "./types.ts"

/**
 * Parses a class name according to the current two-dashes BEM notation.
 *
 * @param {string} className - The class name to parse.
 * @returns {BemClassNameResult} The parsed name or the first structural error.
 */
export function parseBemClassName (className: string): BemClassNameResult {
	let modifierParts = className.split(SEPARATORS.modifier)
	if (modifierParts.length > 2) return { error: `modifier-separator` }

	let entityName = modifierParts[0]
	if (!entityName) return { error: `empty-name` }

	let entityParts = entityName.split(SEPARATORS.element)
	if (entityParts.length > 2) return { error: `nested-element` }
	if (entityParts.some((part) => !part)) return { error: `empty-name` }
	if (entityName.replaceAll(SEPARATORS.element, ``).includes(`_`)) return { error: `element-separator` }

	let parts: BemClassParts = { block: entityParts[0] }
	if (entityParts.length === 2) parts.element = entityParts[1]

	if (modifierParts.length === 1) return { parts }

	let modifierName = modifierParts[1]
	if (!modifierName) return { error: `empty-name` }
	if (modifierName.includes(SEPARATORS.element)) {
		return { error: entityName.includes(SEPARATORS.element) ? `nested-element` : `modifier-separator` }
	}

	let modifierValueParts = modifierName.split(SEPARATORS.modifierValue)
	if (modifierValueParts.length > 2) return { error: `modifier-separator` }
	if (modifierValueParts.some((part) => !part)) return { error: `empty-name` }

	parts.modifier = modifierValueParts[0]
	if (modifierValueParts.length === 2) parts.modifierValue = modifierValueParts[1]

	return { parts }
}
