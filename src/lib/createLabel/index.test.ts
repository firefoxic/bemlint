import { describe, expect, it } from "vitest"

import type { ParsedElement } from "../types.js"

import { createLabel } from "./index.js"

describe(`createLabel`, () => {
	it(`should return tag name only`, () => {
		let node = { tagName: `div`, attribs: {} } as unknown as ParsedElement
		let result = createLabel(node)

		expect(result).toContain(`div`)
	})

	it(`should return tag name with id`, () => {
		let node = { tagName: `div`, attribs: { id: `my-id` } } as unknown as ParsedElement
		let result = createLabel(node)

		expect(result).toContain(`div`)
		expect(result).toContain(`#my-id`)
	})

	it(`should return tag name with class`, () => {
		let node = { tagName: `div`, attribs: { "class": `my-class` } } as unknown as ParsedElement
		let result = createLabel(node)

		expect(result).toContain(`div`)
		expect(result).toContain(`.my-class`)
	})

	it(`should return tag name with multiple classes`, () => {
		let node = { tagName: `div`, attribs: { "class": `class1 class2` } } as unknown as ParsedElement
		let result = createLabel(node)

		expect(result).toContain(`div`)
		expect(result).toContain(`.class1.class2`)
	})

	it(`should return tag name with id and class`, () => {
		let node = { tagName: `div`, attribs: { "id": `my-id`, "class": `my-class` } } as unknown as ParsedElement
		let result = createLabel(node)

		expect(result).toContain(`div`)
		expect(result).toContain(`#my-id`)
		expect(result).toContain(`.my-class`)
	})

	it(`should include error message in label`, () => {
		let node = {
			tagName: `div`,
			attribs: { "class": `my-class` },
			customDataSet: { prefixes: new Set(), errorDefs: new Set([`Test error`]) },
		} as unknown as ParsedElement
		let result = createLabel(node)

		expect(result).toContain(`div`)
		expect(result).toContain(`Test error`)
		expect(result).toContain(`❌`)
	})

	it(`should include multiple error messages in label`, () => {
		let node = {
			tagName: `div`,
			attribs: { "class": `my-class` },
			customDataSet: { prefixes: new Set(), errorDefs: new Set([`Error 1`, `Error 2`]) },
		} as unknown as ParsedElement
		let result = createLabel(node)

		expect(result).toContain(`Error 1`)
		expect(result).toContain(`Error 2`)
	})

	it(`should handle element tag`, () => {
		let node = { tagName: `button`, attribs: {} } as unknown as ParsedElement
		let result = createLabel(node)

		expect(result).toContain(`button`)
	})

	it(`should handle complex tag with id and multiple classes`, () => {
		let node = {
			tagName: `article`,
			attribs: { "id": `post-1`, "class": `post post--featured` },
		} as unknown as ParsedElement
		let result = createLabel(node)

		expect(result).toContain(`article`)
		expect(result).toContain(`#post-1`)
		expect(result).toContain(`.post.post--featured`)
	})
})
