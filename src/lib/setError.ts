import type { CustomDataSet, Warnings } from "./types.js"

/**
 * Sets an error in the provided custom data set.
 *
 * @param {Warnings} warnings - The warnings object to increment count.
 * @param {CustomDataSet} customDataSet - The custom data set to set the error in.
 * @param {string} errorDef - The error message to set.
 */
export function setError (
	warnings: Warnings,
	customDataSet: CustomDataSet,
	errorDef: string,
): void {
	warnings.count += 1
	customDataSet.errorDefs ||= new Set()
	customDataSet.errorDefs.add(errorDef)
}
