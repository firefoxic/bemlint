import { setError } from "./setError.js"

/**
 * Checks separators in class names.
 *
 * @param {HTMLElement} node - The node to check.
 * @param {object} warnings - The warnings object.
 */
export function checkSeparators (node, warnings) {
	if (node.classList.value.join().indexOf(`_`) < 0) return

	let singleUnderscoreRegex = /^(?!.*--)(?=.*[^_]_[^_]).*$/
	let doubleModifierRegex = /--.*(__|--).*$/

	for (let classItem of node.classList.value) {
		if (singleUnderscoreRegex.test(classItem)) {
			setError(warnings, node.customDataSet, `Wrong element separator!`)
		}
		if (doubleModifierRegex.test(classItem)) {
			setError(warnings, node.customDataSet, `Wrong modifier value separator!`)
		}
	}
}
