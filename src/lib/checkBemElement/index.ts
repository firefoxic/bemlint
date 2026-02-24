import type { HTMLElement } from "node-html-parser"

import { SEPARATORS } from "../separators/index.js"
import { setError } from "../setError/index.js"
import type { Warnings } from "../types.js"

/**
 * Checks if the given node is a BEM element.
 *
 * @param {HTMLElement} node - The node to check.
 * @param {Warnings} warnings - The warnings object.
 */
export function checkBemElement (node: HTMLElement, warnings: Warnings): void {
	if (!node.classList.value.join().includes(SEPARATORS.element)) return

	for (let classItem of node.classList.value) {
		let classParts = classItem.split(SEPARATORS.element)

		if (classParts.length > 2 && !classParts[1].includes(SEPARATORS.modifier) && !classParts[0].includes(SEPARATORS.modifier)) {
			setError(warnings, node.customDataSet, `Element of element!`)
		}
		else if (classParts.length > 1 && !classParts[0].includes(SEPARATORS.modifier)) {
			let prefix = classParts[0]

			if (!node.customDataSet.prefixes.has(prefix)) {
				setError(warnings, node.customDataSet, `Element outside its block!`)
			}
			else if (node.classList.contains(prefix)) {
				setError(warnings, node.customDataSet, `Element mixed with its block!`)
			}
		}
	}
}
