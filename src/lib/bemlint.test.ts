import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { describe, expect, it, vi } from "vitest"

vi.mock(`node:console`, () => ({
	error: vi.fn(),
}))

import { bemlint } from "./bemlint.js"

describe(`bemlint`, () => {
	it(`should throw error for empty input`, async () => {
		await expect(bemlint([])).rejects.toThrow(`No input patterns specified`)
	})

	it(`should process valid HTML file without errors`, async () => {
		let tempDir = await mktempDir()

		try {
			let validFile = join(tempDir, `valid.html`)
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

			await expect(bemlint([validFile])).resolves.toBeUndefined()
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should process invalid HTML file and report errors`, async () => {
		let tempDir = await mktempDir()

		try {
			let invalidFile = join(tempDir, `invalid.html`)
			await writeFile(invalidFile, `
<!DOCTYPE html>
<html>
<body>
	<div class="block__element__invalid">Content</div>
</body>
</html>
			`)

			await expect(bemlint([invalidFile])).resolves.toBeUndefined()
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should process multiple files`, async () => {
		let tempDir = await mktempDir()

		try {
			let file1 = join(tempDir, `file1.html`)
			let file2 = join(tempDir, `file2.html`)

			await writeFile(file1, `<div class="block">File 1</div>`)
			await writeFile(file2, `<div class="block__element">File 2</div>`)

			await expect(bemlint([file1, file2])).resolves.toBeUndefined()
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should throw error when no HTML files found`, async () => {
		let tempDir = await mktempDir()

		try {
			await expect(bemlint([join(tempDir, `*.html`)]))
				.rejects
				.toThrow(`No HTML files found matching the specified patterns`)
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should process directory with HTML files`, async () => {
		let tempDir = await mktempDir()

		try {
			let htmlFile = join(tempDir, `test.html`)
			await writeFile(htmlFile, `<div class="block">Content</div>`)

			await expect(bemlint(tempDir)).resolves.toBeUndefined()
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should handle glob patterns`, async () => {
		let tempDir = await mktempDir()

		try {
			let htmlFile = join(tempDir, `test.html`)
			await writeFile(htmlFile, `<div class="block">Content</div>`)

			await expect(bemlint([`${tempDir}/*.html`])).resolves.toBeUndefined()
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should exclude node_modules from glob patterns`, async () => {
		let tempDir = await mktempDir()

		try {
			let nodeModulesFile = join(tempDir, `node_modules`, `package`, `test.html`)
			// Create directory first
			let { mkdir } = await import(`node:fs/promises`)
			await mkdir(join(tempDir, `node_modules`, `package`), { recursive: true })
			await writeFile(nodeModulesFile, `<div class="block">Content</div>`)

			let rootFile = join(tempDir, `root.html`)
			await writeFile(rootFile, `<div class="block">Content</div>`)

			await expect(bemlint([`${tempDir}/**/*.html`])).resolves.toBeUndefined()
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})
})

async function mktempDir (): Promise<string> {
	return await mkdtemp(join(tmpdir(), `bemlint-test-`))
}
