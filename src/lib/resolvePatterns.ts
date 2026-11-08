import { stat } from "node:fs/promises"

import { BemlintError } from "./bemlintError.ts"

function hasGlobPattern (input: string): boolean {
	return [`*`, `?`, `[`, `{`].some((token) => input.includes(token))
}

/**
 * Normalize input patterns, converting directories to glob patterns
 *
 * @param {string[] | string} input - Input patterns (glob, file paths, or directories)
 * @returns {Promise<string[]>} Normalized glob patterns
 */
export async function resolvePatterns (input: string[] | string): Promise<string[]> {
	let inputs = typeof input === `string` ? [input] : input

	return await Promise.all(
		inputs.map(async (inputItem) => {
			try {
				let stats = await stat(inputItem)
				return stats.isDirectory() ? `${inputItem.replace(/\/+$/u, ``)}/**/*.html` : inputItem
			}
			catch (errorObj) {
				let errorCode = errorObj instanceof Error && `code` in errorObj ? errorObj.code : undefined

				if ((errorCode === `ENOENT` || errorCode === `ENOTDIR`) && hasGlobPattern(inputItem)) {
					return inputItem
				}

				if (errorCode === `ENOENT` || errorCode === `ENOTDIR`) {
					throw new BemlintError(`input-path`, `Input path not found: ${inputItem}`)
				}

				let message = errorObj instanceof Error ? errorObj.message : String(errorObj)
				throw new BemlintError(`input-path`, `Unable to inspect input path "${inputItem}": ${message}`)
			}
		}),
	)
}
