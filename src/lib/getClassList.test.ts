import { describe, expect, it } from "vitest"

import { getClassList } from "./getClassList.js"
import type { ParsedElement } from "./types.js"

describe(`getClassList`, () => {
	it(`should return empty array for element without class`, () => {
		let node = { attribs: {} } as ParsedElement
		let result = getClassList(node)

		expect(result).toEqual([])
	})

	it(`should return empty array for element with empty class`, () => {
		let node = { attribs: { "class": `` } } as unknown as ParsedElement
		let result = getClassList(node)

		expect(result).toEqual([])
	})

	it(`should return array with single class`, () => {
		let node = { attribs: { "class": `button` } } as unknown as ParsedElement
		let result = getClassList(node)

		expect(result).toEqual([`button`])
	})

	it(`should return array with multiple classes`, () => {
		let node = { attribs: { "class": `button button--large button--primary` } } as unknown as ParsedElement
		let result = getClassList(node)

		expect(result).toEqual([`button`, `button--large`, `button--primary`])
	})

	it(`should handle multiple spaces between classes`, () => {
		let node = { attribs: { "class": `button   button--large   button--primary` } } as unknown as ParsedElement
		let result = getClassList(node)

		expect(result).toEqual([`button`, `button--large`, `button--primary`])
	})

	it(`should handle leading and trailing spaces`, () => {
		let node = { attribs: { "class": `  button button--large  ` } } as unknown as ParsedElement
		let result = getClassList(node)

		expect(result).toEqual([`button`, `button--large`])
	})

	it(`should handle newlines and tabs in class attribute`, () => {
		let node = { attribs: { "class": `button\nbutton--large\tbutton--primary` } } as unknown as ParsedElement
		let result = getClassList(node)

		expect(result).toEqual([`button`, `button--large`, `button--primary`])
	})
})
