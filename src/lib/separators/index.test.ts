import { describe, expect, it } from "vitest"

import { SEPARATORS } from "./index.js"

describe(`separators`, () => {
	it(`should have correct element separator`, () => {
		expect(SEPARATORS.element).toBe(`__`)
	})

	it(`should have correct modifier separator`, () => {
		expect(SEPARATORS.modifier).toBe(`--`)
	})

	it(`should have correct modifier value separator`, () => {
		expect(SEPARATORS.modifierValue).toBe(`_`)
	})
})
