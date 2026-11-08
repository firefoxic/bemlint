import { styleText } from "node:util"

import { getClassList } from "./getClassList.ts"
import { getId } from "./getId.ts"
import type { ParsedElement } from "./types.ts"

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
