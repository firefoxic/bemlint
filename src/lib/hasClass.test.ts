import { describe, expect, it } from "vitest"

import { hasClass } from "./hasClass.js"
import type { ParsedElement } from "./types.js"

describe(`hasClass`, () => {
	it(`should return false for element without attribs`, () => {
		let node = {} as ParsedElement
		let result = hasClass(node)

		expect(result).toBe(false)
	})

	it(`should return false for element without class`, () => {
		let node = { attribs: {} } as ParsedElement
		let result = hasClass(node)

		expect(result).toBe(false)
	})

	it(`should return false for element with empty class`, () => {
		let node = { attribs: { "class": `` } } as unknown as ParsedElement
		let result = hasClass(node)

		expect(result).toBe(false)
	})

	it(`should return true for element with class`, () => {
		let node = { attribs: { "class": `button` } } as unknown as ParsedElement
		let result = hasClass(node)

		expect(result).toBe(true)
	})

	it(`should return true for element with multiple classes`, () => {
		let node = { attribs: { "class": `button button--large` } } as unknown as ParsedElement
		let result = hasClass(node)

		expect(result).toBe(true)
	})
})
