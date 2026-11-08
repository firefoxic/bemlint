import { error } from "node:console"
import { styleText } from "node:util"

import { generateAsciiTree } from "./generateAsciiTree.ts"
import type { FileLintResult } from "./types.ts"

/**
 * Output lint results for a single file
 *
 * @param {FileLintResult} result - Lint result
 */
export function reportFileResult (result: FileLintResult): void {
	if (`errorObj` in result) {
		error(`Error reading file ${result.filePath}:`, result.errorObj.message)
		return
	}

	error(`\n`, generateAsciiTree(result.ast), styleText([`red`], `\n\nFile: ${result.filePath}\nbemlint: ${result.warningCount} issue${result.warningCount > 1 ? `s` : ``} found!\n`))
}
