import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock(`../lib/bemlint/index.js`, () => ({ bemlint: vi.fn() }))

async function mktempDir (): Promise<string> {
	return await mkdtemp(join(tmpdir(), `bemlint-test-`))
}

describe(`cli`, () => {
	let originalArgv: string[]
	let originalExit: typeof process.exit
	let infoMock: ReturnType<typeof vi.fn>
	let bemlintMock: ReturnType<typeof vi.fn>

	beforeEach(async () => {
		originalArgv = process.argv
		originalExit = process.exit

		let { bemlint } = await import(`../lib/bemlint/index.js`)
		bemlintMock = bemlint as ReturnType<typeof vi.fn>

		infoMock = vi.fn()

		vi.spyOn(console, `info`).mockImplementation(infoMock)
		vi.spyOn(process, `exit`).mockImplementation(vi.fn() as never)
		vi.spyOn(process.stdout, `write`).mockImplementation(vi.fn() as never)
		vi.spyOn(process.stderr, `write`).mockImplementation(vi.fn() as never)
	})

	afterEach(() => {
		process.argv = originalArgv
		process.exit = originalExit
		vi.restoreAllMocks()
		vi.resetModules()
	})

	it(`should show help with --help flag`, async () => {
		process.argv = [`node`, `cli.js`, `--help`]

		await import(`./cli.js`)

		expect(infoMock).toHaveBeenCalledWith(expect.stringContaining(`CLI tool for HTML linting`))
		expect(process.exit).toHaveBeenCalledWith(0)
	})

	it(`should show version with --version flag`, async () => {
		process.argv = [`node`, `cli.js`, `--version`]

		await import(`./cli.js`)

		expect(infoMock).toHaveBeenCalledWith(expect.stringMatching(/\d+\.\d+\.\d+/))
		expect(process.exit).toHaveBeenCalledWith(0)
	})

	it(`should call bemlint with file pattern`, async () => {
		process.argv = [`node`, `cli.js`, `test.html`]

		await import(`./cli.js`)

		expect(bemlintMock).toHaveBeenCalledWith([`test.html`])
	})

	it(`should call bemlint with multiple patterns`, async () => {
		process.argv = [`node`, `cli.js`, `src/**/*.html`, `dist/**/*.html`]

		await import(`./cli.js`)

		expect(bemlintMock).toHaveBeenCalledWith([`src/**/*.html`, `dist/**/*.html`])
	})

	it(`should exit with error for no arguments`, async () => {
		process.argv = [`node`, `cli.js`]

		await import(`./cli.js`)

		// bemlint should be called with empty array when no arguments provided
		expect(bemlintMock).toHaveBeenCalledWith([])
	})

	it(`should handle valid HTML file`, async () => {
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

			process.argv = [`node`, `cli.js`, validFile]

			await import(`./cli.js`)

			expect(bemlintMock).toHaveBeenCalledWith([validFile])
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})
})
