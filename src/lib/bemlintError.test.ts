import { describe, expect, it } from "vitest"

import { BemlintError } from "./bemlintError.ts"

describe(`BemlintError`, () => {
	it(`should preserve the error code and message`, () => {
		let error = new BemlintError(`input-path`, `Input path not found`)

		expect(error).toBeInstanceOf(Error)
		expect(error.name).toBe(`BemlintError`)
		expect(error.code).toBe(`input-path`)
		expect(error.message).toBe(`Input path not found`)
	})
})
