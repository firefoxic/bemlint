import { getClassList } from "../getClassList/index.js"
import { SEPARATORS } from "../separators/index.js"
import { setError } from "../setError/index.js"
import type { ParsedElement, Warnings } from "../types.js"

/**
 * Checks if the given node is a BEM element.
 *
 * @param {ParsedElement} node - The node to check.
 * @param {Warnings} warnings - The warnings object.
 */
export function checkBemElement (node: ParsedElement, warnings: Warnings): void {
	let classList = getClassList(node)
	if (!classList.join().includes(SEPARATORS.element)) return

	for (let classItem of classList) {
		let classParts = classItem.split(SEPARATORS.element)

		if (classParts.length > 2 && !classParts[1].includes(SEPARATORS.modifier) && !classParts[0].includes(SEPARATORS.modifier)) {
			setError(warnings, node.customDataSet, `Element of element!`)
		}
		else if (classParts.length > 1 && !classParts[0].includes(SEPARATORS.modifier)) {
			let prefix = classParts[0]

			if (!node.customDataSet.prefixes.has(prefix)) {
				setError(warnings, node.customDataSet, `Element outside its block!`)
			}
			else if (classList.includes(prefix)) {
				setError(warnings, node.customDataSet, `Element mixed with its block!`)
			}
		}
	}
}
