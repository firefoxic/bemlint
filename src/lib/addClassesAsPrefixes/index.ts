import { getClassList } from "../getClassList/index.js"
import { SEPARATORS } from "../separators/index.js"
import type { ParsedElement } from "../types.js"

/**
 * Adds classes as prefixes to the given node, based on the class names in the parent node.
 *
 * @param {ParsedElement} node - The node to add prefixes to.
 */
export function addClassesAsPrefixes (node: ParsedElement): void {
	node.customDataSet ??= { prefixes: new Set() }

	if (node.parentNode?.customDataSet?.prefixes) {
		node.customDataSet.prefixes = new Set(node.parentNode.customDataSet.prefixes)
	}

	for (let className of getClassList(node)) {
		let isElement = className.includes(SEPARATORS.element)
		let isModifier = className.includes(SEPARATORS.modifier)

		if (isElement || isModifier) return

		node.customDataSet.prefixes.add(className)
	}
}
