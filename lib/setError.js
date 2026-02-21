/**
 * Sets an error in the provided custom data set.
 *
 * @param {object} warnings - The warnings object to increment count.
 * @param {object} customDataSet - The custom data set to set the error in.
 * @param {string} errorDef - The error message to set.
 */
export function setError (warnings, customDataSet, errorDef) {
	warnings.count += 1
	customDataSet.errorDefs ||= new Set()
	customDataSet.errorDefs.add(errorDef)
}
