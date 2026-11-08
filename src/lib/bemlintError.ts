export type BemlintErrorCode = `no-input-patterns` | `no-html-files` | `input-path`

/**
 * An error caused by invalid or unusable bemlint input.
 *
 * @param {BemlintErrorCode} code - The category of input error.
 * @param {string} message - A description of the input error.
 */
export class BemlintError extends Error {
	public code: BemlintErrorCode

	public constructor (code: BemlintErrorCode, message: string) {
		super(message)
		this.name = `BemlintError`
		this.code = code
	}
}
