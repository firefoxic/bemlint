import { mkdir, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"

import { describe, expect, it, vi } from "vitest"

import { resolvePatterns } from "./resolvePatterns.ts"

vi.mock(`node:fs/promises`, async (importOriginal) => {
	let actual = await importOriginal<typeof import("node:fs/promises")>()
	return { ...actual, stat: vi.fn(actual.stat) }
})

describe(`resolvePatterns`, () => {
	it(`should return string input as array with single pattern`, async () => {
		let result = await resolvePatterns(`*.html`)

		expect(result).toEqual([`*.html`])
	})

	it(`should return array input unchanged`, async () => {
		let result = await resolvePatterns([`*.html`, `**/*.html`])

		expect(result).toEqual([`*.html`, `**/*.html`])
	})

	it(`should convert directory path to glob pattern`, async () => {
		let tempDir = await mktempDir()

		try {
			let result = await resolvePatterns(tempDir)

			expect(result).toEqual([`${tempDir}/**/*.html`])
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should handle directory path with trailing slash`, async () => {
		let tempDir = await mktempDir()

		try {
			let result = await resolvePatterns(`${tempDir}/`)

			expect(result).toEqual([`${tempDir}/**/*.html`])
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should handle directory path with multiple trailing slashes`, async () => {
		let tempDir = await mktempDir()

		try {
			let result = await resolvePatterns(`${tempDir}///`)

			expect(result).toEqual([`${tempDir}/**/*.html`])
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should handle mixed input of files and directories`, async () => {
		let tempDir = await mktempDir()
		let filePath = path.join(tempDir, `file.html`)

		try {
			await writeFile(filePath, ``)
			let result = await resolvePatterns([filePath, tempDir, `**/*.html`])

			expect(result).toEqual([filePath, `${tempDir}/**/*.html`, `**/*.html`])
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should handle empty array input`, async () => {
		let result = await resolvePatterns([])

		expect(result).toEqual([])
	})

	it(`should handle empty string input`, async () => {
		await expect(resolvePatterns(``)).rejects.toMatchObject({
			code: `input-path`,
			message: `Input path not found: `,
		})
	})

	it(`should reject a missing literal path`, async () => {
		await expect(resolvePatterns(`missing.html`)).rejects.toMatchObject({
			code: `input-path`,
			message: `Input path not found: missing.html`,
		})
	})

	it(`should report other path inspection errors`, async () => {
		await expect(resolvePatterns(`\u0000`)).rejects.toMatchObject({
			code: `input-path`,
			message: expect.stringContaining(`Unable to inspect input path`),
		})
	})

	it(`should normalize non-Error path inspection failures`, async () => {
		vi.mocked(stat).mockRejectedValueOnce(`stat failure`)

		await expect(resolvePatterns(`file.html`)).rejects.toMatchObject({
			code: `input-path`,
			message: `Unable to inspect input path "file.html": stat failure`,
		})
	})
})

async function mktempDir (): Promise<string> {
	let tempDir = path.join(`/tmp`, `bemlint-test-${Date.now()}`)
	await mkdir(tempDir, { recursive: true })
	return tempDir
}
