import { getClassList } from "./getClassList.js"
import { setError } from "./setError.js"
import type { ParsedElement, Warnings } from "./types.js"

/**
 * Checks separators in class names.
 *
 * @param {ParsedElement} node - The node to check.
 * @param {Warnings} warnings - The warnings object.
 */
export function checkSeparators (node: ParsedElement, warnings: Warnings): void {
	let classList = getClassList(node)
	if (classList.join().indexOf(`_`) < 0) return

	let singleUnderscoreRegex = /^(?!.*--)(?=.*[^_]_[^_]).*$/
	let doubleModifierRegex = /--.*(__|--).*$/

	for (let classItem of classList) {
		if (singleUnderscoreRegex.test(classItem)) {
			setError(warnings, node.customDataSet, `Wrong element separator!`)
		}
		if (doubleModifierRegex.test(classItem)) {
			setError(warnings, node.customDataSet, `Wrong modifier value separator!`)
		}
	}
}
