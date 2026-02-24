import { styleText } from "node:util"

import { getClassList } from "../getClassList/index.js"
import { getId } from "../getId/index.js"
import type { ParsedElement } from "../types.js"

/**
 * Generates a tree label based on the given node.
 *
 * @param {ParsedElement} node - The node to generate the label tree from.
 * @returns {string} The label tree generated from the node.
 */
export function createLabel (node: ParsedElement): string {
	let label = styleText(`cyanBright`, node.tagName)

	let id = getId(node)
	if (id) {
		label += styleText(`yellow`, `#${id.replace(` `, `#`)}`)
	}

	let classList = getClassList(node)
	if (classList.length > 0) {
		label += styleText(`greenBright`, `.${classList.join(`.`)}`)
	}

	if (node.customDataSet?.errorDefs?.size) {
		label += ` ❌ ${styleText(`bold`, [...node.customDataSet.errorDefs.keys()].join(` `))}`
	}

	return label
}
