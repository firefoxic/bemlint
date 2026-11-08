import { error } from "node:console"

import { describe, expect, it, vi } from "vitest"

import { reportFileResult } from "./reportFileResult.ts"
import type { FileLintError, FileLintSuccess } from "./types.ts"

vi.mock(`node:console`, () => ({
	error: vi.fn(),
}))

describe(`reportFileResult`, () => {
	it(`should report lint issues without changing process state`, () => {
		let originalExitCode = process.exitCode
		let originalForceColor = process.env.FORCE_COLOR

		try {
			let result: FileLintSuccess = {
				filePath: `/test/file.html`,
				warningCount: 3,
				diagnostics: [],
				ast: { label: `div`, nodes: [] },
			}

			reportFileResult(result)

			expect(error).toHaveBeenCalledWith(
				`\n`,
				expect.any(String),
				expect.stringContaining(`bemlint: 3 issues found!`),
			)
			expect(process.exitCode).toBe(originalExitCode)
			expect(process.env.FORCE_COLOR).toBe(originalForceColor)
		}
		finally {
			process.exitCode = originalExitCode
			process.env.FORCE_COLOR = originalForceColor
		}
	})

	it(`should report file errors without changing process state`, () => {
		let originalExitCode = process.exitCode
		let originalForceColor = process.env.FORCE_COLOR

		try {
			let result: FileLintError = {
				filePath: `/test/file.html`,
				errorObj: new Error(`Test error`),
			}

			reportFileResult(result)

			expect(error).toHaveBeenCalledWith(`Error reading file /test/file.html:`, `Test error`)
			expect(process.exitCode).toBe(originalExitCode)
			expect(process.env.FORCE_COLOR).toBe(originalForceColor)
		}
		finally {
			process.exitCode = originalExitCode
			process.env.FORCE_COLOR = originalForceColor
		}
	})

	it(`should include the file path in the report`, () => {
		let originalExitCode = process.exitCode
		let originalForceColor = process.env.FORCE_COLOR

		try {
			let result: FileLintSuccess = {
				filePath: `/path/to/test/file.html`,
				warningCount: 2,
				diagnostics: [],
				ast: { label: `div`, nodes: [] },
			}

			reportFileResult(result)

			expect(error).toHaveBeenCalledWith(
				`\n`,
				expect.any(String),
				expect.stringContaining(`File: /path/to/test/file.html`),
			)
		}
		finally {
			process.exitCode = originalExitCode
			process.env.FORCE_COLOR = originalForceColor
		}
	})
})
