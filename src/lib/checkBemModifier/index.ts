import type { HTMLElement } from "node-html-parser"

import { SEPARATORS } from "../separators/index.js"
import { setError } from "../setError/index.js"
import type { Warnings } from "../types.js"

/**
 * Checks if the given node has a BEM modifier.
 *
 * @param {HTMLElement} node - The node to check.
 * @param {Warnings} warnings - The warnings object.
 */
export function checkBemModifier (node: HTMLElement, warnings: Warnings): void {
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
