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
			setError(warnings, node.customDataSet, `Wrong element separator!`)
		}
		else if (`error` in result && result.error === `modifier-separator`) {
			setError(warnings, node.customDataSet, `Wrong modifier value separator!`)
		}
		else if (`error` in result && result.error === `empty-name`) {
			setError(warnings, node.customDataSet, `Empty BEM name segment!`)
		}
	}
}
