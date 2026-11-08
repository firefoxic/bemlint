import { getClassList } from "./getClassList.ts"
import { parseBemClassName } from "./parseBemClassName.ts"
import { setError } from "./setError.ts"
import type { ParsedElement, Warnings } from "./types.ts"

/**
 * Checks if the given node is a BEM element.
 *
 * @param {ParsedElement} node - The node to check.
 * @param {Warnings} warnings - The warnings object.
 */
export function checkBemElement (node: ParsedElement, warnings: Warnings): void {
	let classList = getClassList(node)

	for (let classItem of classList) {
		let result = parseBemClassName(classItem)
		if (`error` in result) {
			if (result.error === `nested-element`) setError(warnings, node.customDataSet, `Element of element!`)
			continue
		}

		if (result.parts.element) {
			let prefix = result.parts.block

			if (!node.customDataSet.prefixes.has(prefix)) {
				setError(warnings, node.customDataSet, `Element outside its block!`)
			}
			else if (classList.includes(prefix)) {
				setError(warnings, node.customDataSet, `Element mixed with its block!`)
			}
		}
	}
}
