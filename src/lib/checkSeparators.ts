import { getClassList } from "./getClassList.ts"
import { parseBemClassName } from "./parseBemClassName.ts"
import { setError } from "./setError.ts"
import type { ParsedElement, Warnings } from "./types.ts"

/**
 * Checks separators in class names.
 *
 * @param {ParsedElement} node - The node to check.
 * @param {Warnings} warnings - The warnings object.
 */
export function checkSeparators (node: ParsedElement, warnings: Warnings): void {
	let classList = getClassList(node)

	for (let classItem of classList) {
		let result = parseBemClassName(classItem)

		if (`error` in result && result.error === `element-separator`) {
			setError(warnings, node, `Wrong element separator!`, `bem/element-separator`, classItem)
		}
		else if (`error` in result && result.error === `modifier-separator`) {
			setError(warnings, node, `Wrong modifier value separator!`, `bem/modifier-separator`, classItem)
		}
		else if (`error` in result && result.error === `empty-name`) {
			setError(warnings, node, `Empty BEM name segment!`, `bem/empty-name-segment`, classItem)
		}
	}
}
