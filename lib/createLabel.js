import { styleText } from "node:util"

/**
 * Generates a tree label based on the given node.
 *
 * @param {Object} node - The node to generate the label tree from.
 * @returns {string} The label tree generated from the node.
 */
export function createLabel (node) {
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
