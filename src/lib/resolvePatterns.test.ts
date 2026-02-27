import { mkdir, rm } from "node:fs/promises"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import { resolvePatterns } from "./resolvePatterns.js"

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

		try {
			let result = await resolvePatterns([`file.html`, tempDir, `**/*.html`])

			expect(result).toEqual([`file.html`, `${tempDir}/**/*.html`, `**/*.html`])
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
		let result = await resolvePatterns(``)

		expect(result).toEqual([``])
	})
})

async function mktempDir (): Promise<string> {
	let tempDir = join(`/tmp`, `bemlint-test-${Date.now()}`)
	await mkdir(tempDir, { recursive: true })
	return tempDir
}
