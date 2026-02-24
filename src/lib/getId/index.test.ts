import { describe, expect, it } from "vitest"

import type { ParsedElement } from "../types.js"

import { getId } from "./index.js"

describe(`getId`, () => {
	it(`should return empty string for element without id`, () => {
		let node = { attribs: {} } as ParsedElement
		let result = getId(node)

		expect(result).toBe(``)
	})

	it(`should return empty string for element with empty id`, () => {
		let node = { attribs: { id: `` } } as ParsedElement
		let result = getId(node)

		expect(result).toBe(``)
	})

	it(`should return id value`, () => {
		let node = { attribs: { id: `my-element` } } as ParsedElement
		let result = getId(node)

		expect(result).toBe(`my-element`)
	})

	it(`should return id with spaces`, () => {
		let node = { attribs: { id: `my element` } } as ParsedElement
		let result = getId(node)

		expect(result).toBe(`my element`)
	})
})
