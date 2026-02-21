import { SEPARATORS } from "./separators.js"
import { setError } from "./setError.js"

/**
 * Checks if the given node has a BEM modifier.
 *
 * @param {HTMLElement} node - The node to check.
 * @param {object} warnings - The warnings object.
 */
export function checkBemModifier (node, warnings) {
	if (node.classList.value.join().indexOf(SEPARATORS.modifier) < 0) return

	for (let classItem of node.classList.value) {
		if (classItem.split(SEPARATORS.modifier).length > 1) {
			let modifierPrefix = classItem.split(SEPARATORS.modifier)[0]

			if (!node.classList.value.includes(modifierPrefix)) {
				setError(warnings, node.customDataSet, `Modifier without modifiable!`)
			}
		}
	}
}
