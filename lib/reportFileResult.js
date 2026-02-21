import { error } from "node:console"
import process from "node:process"
import { styleText } from "node:util"

import { generateAsciiTree } from "./generateAsciiTree.js"

/**
 * Output lint results for a single file
 *
 * @param {{filePath: string, warningCount: number, ast: object}|{filePath: string, errorObj: Error}} result - Lint result
 *
 * @returns {void}
 */
export function reportFileResult (result) {
	process.exitCode = 1
	process.env.FORCE_COLOR = 2

	let { filePath, warningCount, ast, errorObj } = result

	if (errorObj) {
		error(`Error reading file ${filePath}:`, errorObj.message)
		return
	}

	error(`\n`, generateAsciiTree(ast), styleText([`red`], `\n\nFile: ${filePath}\nbemlint: ${warningCount} issue${warningCount > 1 ? `s` : ``} found!\n`))
}
