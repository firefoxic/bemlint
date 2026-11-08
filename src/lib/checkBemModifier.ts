import { getClassList } from "./getClassList.ts"
import { parseBemClassName } from "./parseBemClassName.ts"
import { setError } from "./setError.ts"
import type { ParsedElement, Warnings } from "./types.ts"

/**
 * Checks if the given node has a BEM modifier.
 *
 * @param {ParsedElement} node - The node to check.
 * @param {Warnings} warnings - The warnings object.
 */
export function checkBemModifier (node: ParsedElement, warnings: Warnings): void {
	let classList = getClassList(node)

	for (let classItem of classList) {
		let result = parseBemClassName(classItem)
		if (`error` in result || !result.parts.modifier) continue

		let modifierPrefix = result.parts.element
			? `${result.parts.block}__${result.parts.element}`
			: result.parts.block

		if (!classList.includes(modifierPrefix)) {
			setError(warnings, node, `Modifier without modifiable!`, `bem/modifier-without-base`, classItem)
		}
	}
}
