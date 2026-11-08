import { readFile } from "node:fs/promises"

import { describe, expect, it, vi } from "vitest"

import { lintFile } from "./lintFile.ts"

vi.mock(`node:fs/promises`, async (importOriginal) => {
	let actual = await importOriginal<typeof import("node:fs/promises")>()
	return { ...actual, readFile: vi.fn(actual.readFile) }
})

describe(`lintFile`, () => {
	it(`should return null for valid BEM file`, async () => {
		let result = await lintFile(new URL(`../../fixtures/valid.html`, import.meta.url).pathname)

		expect(result).toBeNull()
	})

	it(`should return result with warnings for invalid BEM file`, async () => {
		let result = await lintFile(new URL(`../../fixtures/error-complex.html`, import.meta.url).pathname)

		expect(result).not.toBeNull()
		expect(result).toHaveProperty(`filePath`)
		expect(result).toHaveProperty(`warningCount`)
		expect(result).toHaveProperty(`ast`)
		expect((result as { warningCount: number }).warningCount).toBeGreaterThan(0)
	})

	it(`should include correct filePath in result`, async () => {
		let filePath = new URL(`../../fixtures/error-complex.html`, import.meta.url).pathname
		let result = await lintFile(filePath)

		expect((result as { filePath: string }).filePath).toBe(filePath)
	})

	it(`should return error result for non-existent file`, async () => {
		let result = await lintFile(`/non/existent/file.html`)

		expect(result).not.toBeNull()
		expect(result).toHaveProperty(`filePath`)
		expect(result).toHaveProperty(`code`, `file-read`)
		expect(result).toHaveProperty(`errorObj`)
	})

	it(`should return error result for directory path`, async () => {
		let result = await lintFile(`/tmp`)

		expect(result).not.toBeNull()
		expect(result).toHaveProperty(`errorObj`)
	})

	it(`should normalize non-Error file read failures`, async () => {
		vi.mocked(readFile).mockRejectedValueOnce(`read failure`)
		let filePath = new URL(`../../fixtures/valid.html`, import.meta.url).pathname
		let result = await lintFile(filePath)

		expect(result).toMatchObject({
			filePath,
			code: `file-read`,
			errorObj: { message: `read failure` },
		})
	})

	it(`should return correct warning count for element error file`, async () => {
		let result = await lintFile(new URL(`../../fixtures/error-in-element-without-block.html`, import.meta.url).pathname)

		expect(result).not.toBeNull()
		expect((result as { warningCount: number }).warningCount).toBe(1)
	})

	it(`should return correct warning count for modifier error file`, async () => {
		let result = await lintFile(new URL(`../../fixtures/error-in-modifiers.html`, import.meta.url).pathname)

		expect(result).not.toBeNull()
		expect((result as { warningCount: number }).warningCount).toBe(2)
	})

	it(`should return correct warning count for separator error file`, async () => {
		let result = await lintFile(new URL(`../../fixtures/error-in-separators.html`, import.meta.url).pathname)

		expect(result).not.toBeNull()
		expect((result as { warningCount: number }).warningCount).toBe(3)
	})
})
