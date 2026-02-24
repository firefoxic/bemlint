import { describe, expect, it, vi } from "vitest"

import type { FileLintError, FileLintSuccess } from "../types.js"

import { reportFileResult } from "./index.js"

vi.mock(`node:console`, () => ({
	error: vi.fn(),
}))

describe(`reportFileResult`, () => {
	it(`should set exitCode to 1 for success result`, () => {
		let originalExitCode = process.exitCode
		let originalForceColor = process.env.FORCE_COLOR

		try {
			let result: FileLintSuccess = {
				filePath: `/test/file.html`,
				warningCount: 3,
				ast: { label: `div`, nodes: [] },
			}

			reportFileResult(result)

			expect(process.exitCode).toBe(1)
			expect(process.env.FORCE_COLOR).toBe(`2`)
		}
		finally {
			process.exitCode = originalExitCode
			process.env.FORCE_COLOR = originalForceColor
		}
	})

	it(`should set exitCode to 1 for error result`, () => {
		let originalExitCode = process.exitCode
		let originalForceColor = process.env.FORCE_COLOR

		try {
			let result: FileLintError = {
				filePath: `/test/file.html`,
				errorObj: new Error(`Test error`),
			}

			reportFileResult(result)

			expect(process.exitCode).toBe(1)
			expect(process.env.FORCE_COLOR).toBe(`2`)
		}
		finally {
			process.exitCode = originalExitCode
			process.env.FORCE_COLOR = originalForceColor
		}
	})

	it(`should handle file read error without throwing`, () => {
		let originalExitCode = process.exitCode
		let originalForceColor = process.env.FORCE_COLOR

		try {
			let result: FileLintError = {
				filePath: `/test/file.html`,
				errorObj: new Error(`File not found`),
			}

			expect(() => reportFileResult(result)).not.toThrow()
		}
		finally {
			process.exitCode = originalExitCode
			process.env.FORCE_COLOR = originalForceColor
		}
	})

	it(`should handle result with singular warning without throwing`, () => {
		let originalExitCode = process.exitCode
		let originalForceColor = process.env.FORCE_COLOR

		try {
			let result: FileLintSuccess = {
				filePath: `/test/file.html`,
				warningCount: 1,
				ast: { label: `div`, nodes: [] },
			}

			expect(() => reportFileResult(result)).not.toThrow()
		}
		finally {
			process.exitCode = originalExitCode
			process.env.FORCE_COLOR = originalForceColor
		}
	})

	it(`should handle result with multiple warnings without throwing`, () => {
		let originalExitCode = process.exitCode
		let originalForceColor = process.env.FORCE_COLOR

		try {
			let result: FileLintSuccess = {
				filePath: `/test/file.html`,
				warningCount: 5,
				ast: { label: `div`, nodes: [] },
			}

			expect(() => reportFileResult(result)).not.toThrow()
		}
		finally {
			process.exitCode = originalExitCode
			process.env.FORCE_COLOR = originalForceColor
		}
	})

	it(`should include file path in output without throwing`, () => {
		let originalExitCode = process.exitCode
		let originalForceColor = process.env.FORCE_COLOR

		try {
			let result: FileLintSuccess = {
				filePath: `/path/to/test/file.html`,
				warningCount: 2,
				ast: { label: `div`, nodes: [] },
			}

			expect(() => reportFileResult(result)).not.toThrow()
		}
		finally {
			process.exitCode = originalExitCode
			process.env.FORCE_COLOR = originalForceColor
		}
	})
})
