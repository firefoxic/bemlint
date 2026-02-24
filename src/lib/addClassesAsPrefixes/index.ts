import type { HTMLElement } from "node-html-parser"

import { SEPARATORS } from "../separators/index.js"

/**
 * Adds classes as prefixes to the given node, based on the class names in the parent node.
 *
 * @param {HTMLElement} node - The node to add prefixes to.
 */
export function addClassesAsPrefixes (node: HTMLElement): void {
	node.customDataSet ??= { prefixes: new Set() }

	if (node.parentNode?.customDataSet?.prefixes) {
		node.customDataSet.prefixes = new Set(node.parentNode.customDataSet.prefixes)
	}

	for (let className of node.classList.value) {
		let isElement = className.includes(SEPARATORS.element)
		let isModifier = className.includes(SEPARATORS.modifier)

		if (isElement || isModifier) return

		node.customDataSet.prefixes.add(className)
	}
}
