import { error } from "node:console"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { describe, expect, it, vi } from "vitest"

import { bemlint } from "./bemlint.ts"

vi.mock(`node:console`, () => ({
	error: vi.fn(),
}))

describe(`bemlint`, () => {
	it(`should throw error for empty input`, async () => {
		await expect(bemlint([])).rejects.toMatchObject({
			code: `no-input-patterns`,
			message: `No input patterns specified`,
		})
	})

	it(`should process valid HTML file without errors`, async () => {
		let tempDir = await mktempDir()

		try {
			let validFile = path.join(tempDir, `valid.html`)
			await writeFile(validFile, `
<!DOCTYPE html>
<html>
<body>
	<div class="block">
		<span class="block__element">Content</span>
	</div>
</body>
</html>
			`)

			await expect(bemlint([validFile])).resolves.toEqual({
				checkedFileCount: 1,
				results: [],
			})
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should process invalid HTML file and report errors`, async () => {
		let tempDir = await mktempDir()

		try {
			let invalidFile = path.join(tempDir, `invalid.html`)
			let validFile = path.join(tempDir, `valid.html`)
			await writeFile(invalidFile, `
<!DOCTYPE html>
<html>
<body>
	<div class="block__element__invalid">Content</div>
</body>
</html>
			`)
			await writeFile(validFile, `<div class="block">Content</div>`)

			let originalExitCode = process.exitCode
			let originalForceColor = process.env.FORCE_COLOR

			try {
				vi.mocked(error).mockClear()
				let result = await bemlint([invalidFile])

				expect(result.checkedFileCount).toBe(1)
				expect(result.results).toHaveLength(1)
				expect(result.results[0]).toMatchObject({
					filePath: invalidFile,
					warningCount: 1,
				})
				let cleanResult = await bemlint([validFile])

				expect(cleanResult).toEqual({ checkedFileCount: 1, results: [] })
				expect(process.exitCode).toBe(originalExitCode)
				expect(process.env.FORCE_COLOR).toBe(originalForceColor)
				expect(error).not.toHaveBeenCalled()
			}
			finally {
				process.exitCode = originalExitCode
				process.env.FORCE_COLOR = originalForceColor
			}
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should process multiple files`, async () => {
		let tempDir = await mktempDir()

		try {
			let file1 = path.join(tempDir, `file1.html`)
			let file2 = path.join(tempDir, `file2.html`)

			await writeFile(file1, `<div class="block">File 1</div>`)
			await writeFile(file2, `<div class="block"><span class="block__element">File 2</span></div>`)

			let result = await bemlint([file1, file2])

			expect(result.checkedFileCount).toBe(2)
			expect(result.results).toEqual([])
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should throw error when no HTML files found`, async () => {
		let tempDir = await mktempDir()

		try {
			await expect(bemlint([path.join(tempDir, `*.html`)]))
				.rejects
				.toMatchObject({
					code: `no-html-files`,
					message: `No HTML files found matching the specified patterns`,
				})
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should report direct input paths that do not exist`, async () => {
		let tempDir = await mktempDir()
		let missingFile = path.join(tempDir, `missing.html`)

		try {
			await expect(bemlint(missingFile)).rejects.toMatchObject({
				code: `input-path`,
				message: `Input path not found: ${missingFile}`,
			})
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should return file read errors alongside successfully checked files`, async () => {
		let tempDir = await mktempDir()
		let validFile = path.join(tempDir, `valid.html`)
		let unreadablePath = path.join(tempDir, `unreadable.html`)

		try {
			await writeFile(validFile, `<div class="block">Content</div>`)
			await mkdir(unreadablePath)

			let result = await bemlint(`${tempDir}/*.html`)

			expect(result.checkedFileCount).toBe(2)
			expect(result.results).toHaveLength(1)
			expect(result.results[0]).toMatchObject({
				filePath: unreadablePath,
				code: `file-read`,
				errorObj: { code: `EISDIR` },
			})
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should process directory with HTML files`, async () => {
		let tempDir = await mktempDir()

		try {
			let htmlFile = path.join(tempDir, `test.html`)
			await writeFile(htmlFile, `<div class="block">Content</div>`)

			await expect(bemlint(tempDir)).resolves.toMatchObject({
				checkedFileCount: 1,
				results: [],
			})
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should handle glob patterns`, async () => {
		let tempDir = await mktempDir()

		try {
			let htmlFile = path.join(tempDir, `test.html`)
			await writeFile(htmlFile, `<div class="block">Content</div>`)

			await expect(bemlint([`${tempDir}/*.html`])).resolves.toMatchObject({
				checkedFileCount: 1,
				results: [],
			})
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should exclude node_modules from glob patterns`, async () => {
		let tempDir = await mktempDir()

		try {
			let nodeModulesFile = path.join(tempDir, `node_modules`, `package`, `test.html`)
			await mkdir(path.join(tempDir, `node_modules`, `package`), { recursive: true })
			await writeFile(nodeModulesFile, `<div class="block">Content</div>`)

			let rootFile = path.join(tempDir, `root.html`)
			await writeFile(rootFile, `<div class="block">Content</div>`)

			let result = await bemlint([`${tempDir}/**/*.html`])

			expect(result.checkedFileCount).toBeGreaterThan(0)
			expect(result.results).toEqual([])
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})
})

async function mktempDir (): Promise<string> {
	return await mkdtemp(path.join(tmpdir(), `bemlint-test-`))
}
