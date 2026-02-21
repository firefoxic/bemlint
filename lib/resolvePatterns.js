import { stat } from "node:fs/promises"

/**
 * Normalize input patterns, converting directories to glob patterns
 *
 * @param {string[]|string} input - Input patterns (glob, file paths, or directories)
 *
 * @returns {Promise<string[]>} Normalized glob patterns
 */
export function resolvePatterns (input) {
	let inputs = typeof input === `string` ? [input] : input

	return Promise.all(
		inputs.map(async (inputItem) => {
			let stats = await stat(inputItem).catch(() => null)
			return stats?.isDirectory() ? `${inputItem.replace(/\/+$/, ``)}/**/*.html` : inputItem
		}),
	)
}
