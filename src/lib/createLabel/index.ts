import { styleText } from "node:util"

import type { HTMLElement } from "node-html-parser"

/**
 * Generates a tree label based on the given node.
 *
 * @param {HTMLElement} node - The node to generate the label tree from.
 * @returns {string} The label tree generated from the node.
 */
export function createLabel (node: HTMLElement): string {
	let label = styleText(`cyanBright`, node.tagName)

	if (node.id) {
		label += styleText(`yellow`, `#${node.id.replace(` `, `#`)}`)
	}

	if (node.classList.length > 0) {
		label += styleText(`greenBright`, `.${node.classList.value.join(`.`)}`)
	}

	if (node.customDataSet?.errorDefs?.size) {
		label += ` ❌ ${styleText(`bold`, [...node.customDataSet.errorDefs.keys()].join(` `))}`
	}

	return label
}
