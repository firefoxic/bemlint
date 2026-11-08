import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock(`../lib/bemlint.js`, () => ({ bemlint: vi.fn() }))

async function mktempDir (): Promise<string> {
	return await mkdtemp(path.join(tmpdir(), `bemlint-test-`))
}

describe(`cli`, () => {
	let originalArgv: string[]
	let originalExit: typeof process.exit
	let originalExitCode: typeof process.exitCode
	let originalForceColor: string | undefined
	let infoMock: ReturnType<typeof vi.fn>
	let bemlintMock: ReturnType<typeof vi.fn>

	beforeEach(async () => {
		originalArgv = process.argv
		originalExit = process.exit
		originalExitCode = process.exitCode
		originalForceColor = process.env.FORCE_COLOR

		let { bemlint } = await import(`../lib/bemlint.js`)
		bemlintMock = bemlint as ReturnType<typeof vi.fn>
		bemlintMock.mockResolvedValue({ checkedFileCount: 0, results: [] })

		infoMock = vi.fn()

		vi.spyOn(console, `info`).mockImplementation(infoMock as (...args: unknown[]) => void)
		vi.spyOn(process, `exit`).mockImplementation(vi.fn() as never)
		vi.spyOn(process.stdout, `write`).mockImplementation(vi.fn() as never)
		vi.spyOn(process.stderr, `write`).mockImplementation(vi.fn() as never)
	})

	afterEach(() => {
		process.argv = originalArgv
		process.exit = originalExit
		process.exitCode = originalExitCode
		process.env.FORCE_COLOR = originalForceColor
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

		expect(infoMock).toHaveBeenCalledWith(expect.stringMatching(/\d+\.\d+\.\d+/u))
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

			process.argv = [`node`, `cli.js`, validFile]

			await import(`./cli.js`)

			expect(bemlintMock).toHaveBeenCalledWith([validFile])
		}
		finally {
			await rm(tempDir, { recursive: true, force: true })
		}
	})

	it(`should report lint results and set the exit code`, async () => {
		bemlintMock.mockResolvedValueOnce({
			checkedFileCount: 1,
			results: [
				{
					filePath: `invalid.html`,
					warningCount: 1,
					diagnostics: [],
					ast: { label: `div`, nodes: [] },
				},
			],
		})
		process.argv = [`node`, `cli.js`, `invalid.html`]

		await import(`./cli.js`)

		expect(process.exitCode).toBe(1)
		expect(process.env.FORCE_COLOR).toBe(`2`)
	})

	it(`should emit structured JSON results without the text tree`, async () => {
		bemlintMock.mockResolvedValueOnce({
			checkedFileCount: 1,
			results: [
				{
					filePath: `invalid.html`,
					warningCount: 1,
					diagnostics: [
						{
							ruleId: `bem/element-outside-block`,
							message: `Element outside its block!`,
							className: `block__element`,
							location: { line: 2, column: 1 },
						},
					],
					ast: { label: `div ❌ Element outside its block!`, nodes: [] },
				},
			],
		})
		process.argv = [`node`, `cli.js`, `--format`, `json`, `invalid.html`]

		await import(`./cli.js`)

		expect(infoMock).toHaveBeenCalledWith(JSON.stringify({
			checkedFileCount: 1,
			results: [
				{
					filePath: `invalid.html`,
					warningCount: 1,
					diagnostics: [
						{
							ruleId: `bem/element-outside-block`,
							message: `Element outside its block!`,
							className: `block__element`,
							location: { line: 2, column: 1 },
						},
					],
				},
			],
		}))
		expect(process.exitCode).toBe(1)
	})

	it(`should emit an empty JSON result for a clean scan`, async () => {
		bemlintMock.mockResolvedValueOnce({ checkedFileCount: 2, results: [] })
		process.argv = [`node`, `cli.js`, `-f`, `json`, `valid.html`]

		await import(`./cli.js`)

		expect(infoMock).toHaveBeenCalledWith(JSON.stringify({ checkedFileCount: 2, results: [] }))
		expect(process.exitCode).toBe(originalExitCode)
	})

	it(`should include file errors in JSON results`, async () => {
		bemlintMock.mockResolvedValueOnce({
			checkedFileCount: 1,
			results: [
				{
					filePath: `unreadable.html`,
					errorObj: new Error(`Permission denied`),
				},
			],
		})
		process.argv = [`node`, `cli.js`, `--format`, `json`, `unreadable.html`]

		await import(`./cli.js`)

		expect(infoMock).toHaveBeenCalledWith(JSON.stringify({
			checkedFileCount: 1,
			results: [
				{
					filePath: `unreadable.html`,
					error: { name: `Error`, message: `Permission denied` },
				},
			],
		}))
		expect(process.exitCode).toBe(1)
	})

	it(`should emit invocation errors in JSON format`, async () => {
		bemlintMock.mockRejectedValueOnce(new Error(`No input patterns specified`))
		process.argv = [`node`, `cli.js`, `--format`, `json`]

		await import(`./cli.js`)

		expect(infoMock).toHaveBeenCalledWith(JSON.stringify({
			error: { name: `Error`, message: `No input patterns specified` },
		}))
		expect(process.exit).toHaveBeenCalledWith(1)
	})

	it(`should serialize non-Error failures in JSON format`, async () => {
		bemlintMock.mockRejectedValueOnce(`Unexpected failure`)
		process.argv = [`node`, `cli.js`, `--format`, `json`, `input.html`]

		await import(`./cli.js`)

		expect(infoMock).toHaveBeenCalledWith(JSON.stringify({
			error: { name: `Error`, message: `Unexpected failure` },
		}))
		expect(process.exit).toHaveBeenCalledWith(1)
	})

	it.each([
		[[`--format`, `xml`], `Unknown output format "xml". Available formats: text, json`],
		[[`--format`], `Unknown output format "". Available formats: text, json`],
	])(`should reject unsupported output format arguments`, async (formatArgs, message) => {
		let errorMock = vi.fn()
		vi.spyOn(console, `error`).mockImplementation(errorMock as (...args: unknown[]) => void)
		process.argv = [`node`, `cli.js`, ...formatArgs]

		await import(`./cli.js`)

		expect(bemlintMock).not.toHaveBeenCalled()
		expect(errorMock).toHaveBeenCalledWith(`Error: ${message}\nRun \`bemlint --help\` for usage information`)
		expect(process.exit).toHaveBeenCalledWith(1)
	})

	it(`should handle errors from bemlint`, async () => {
		let errorMock = vi.fn()
		vi.spyOn(console, `error`).mockImplementation(errorMock as (...args: unknown[]) => void)

		bemlintMock.mockImplementationOnce(() => {
			throw new Error(`Test error`)
		})

		process.argv = [`node`, `cli.js`, `test.html`]

		await import(`./cli.js`)

		expect(bemlintMock).toHaveBeenCalledWith([`test.html`])
		expect(errorMock).toHaveBeenCalledWith(`Error: Test error\nRun \`bemlint --help\` for usage information`)
		expect(process.exit).toHaveBeenCalledWith(1)
	})
})
