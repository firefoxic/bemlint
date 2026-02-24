import { getClassList } from "../getClassList/index.js"
import { SEPARATORS } from "../separators/index.js"
import { setError } from "../setError/index.js"
import type { ParsedElement, Warnings } from "../types.js"

/**
 * Checks if the given node has a BEM modifier.
 *
 * @param {ParsedElement} node - The node to check.
 * @param {Warnings} warnings - The warnings object.
 */
export function checkBemModifier (node: ParsedElement, warnings: Warnings): void {
	let classList = getClassList(node)
	if (classList.join().indexOf(SEPARATORS.modifier) < 0) return

	for (let classItem of classList) {
		if (classItem.split(SEPARATORS.modifier).length > 1) {
			let modifierPrefix = classItem.split(SEPARATORS.modifier)[0]

			if (!classList.includes(modifierPrefix)) {
				setError(warnings, node.customDataSet, `Modifier without modifiable!`)
			}
		}
	}
}
