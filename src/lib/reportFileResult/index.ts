import { error } from "node:console"
import process from "node:process"
import { styleText } from "node:util"

import { generateAsciiTree } from "../generateAsciiTree/index.js"
import type { FileLintError, FileLintSuccess } from "../types.js"

/**
 * Output lint results for a single file
 *
 * @param {FileLintSuccess | FileLintError} result - Lint result
 */
export function reportFileResult (result: FileLintSuccess | FileLintError): void {
	process.exitCode = 1
	process.env.FORCE_COLOR = `2`

	if (`errorObj` in result && result.errorObj) {
		error(`Error reading file ${result.filePath}:`, result.errorObj.message)
		return
	}

	let successResult = result as FileLintSuccess
	error(`\n`, generateAsciiTree(successResult.ast), styleText([`red`], `\n\nFile: ${successResult.filePath}\nbemlint: ${successResult.warningCount} issue${successResult.warningCount > 1 ? `s` : ``} found!\n`))
}
