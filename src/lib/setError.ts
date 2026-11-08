import type { ParsedElement, Warnings } from "./types.ts"

/**
 * Sets an error in the provided custom data set.
 *
 * @param {Warnings} warnings - The warnings object to increment count.
 * @param {ParsedElement} node - The node associated with the error.
 * @param {string} errorDef - The error message to set.
 * @param {string} ruleId - The stable identifier of the lint rule.
 * @param {string} className - The class name that violates the rule.
 */
export function setError (
	warnings: Warnings,
	node: ParsedElement,
	errorDef: string,
	ruleId: string,
	className: string,
): void {
	warnings.count += 1
	node.customDataSet.errorDefs ||= new Set()
	node.customDataSet.errorDefs.add(errorDef)
	warnings.diagnostics ||= []

	let sourceCodeLocation = node.sourceCodeLocation
	let diagnostic = {
		ruleId,
		message: errorDef,
		className,
		...(sourceCodeLocation && {
			location: {
				line: sourceCodeLocation.startLine,
				column: sourceCodeLocation.startCol,
			},
		}),
	}

	warnings.diagnostics.push(diagnostic)
}
