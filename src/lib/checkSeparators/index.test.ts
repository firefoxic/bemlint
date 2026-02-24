import { describe, expect, it } from "vitest"

import type { ParsedElement, Warnings } from "../types.js"

import { checkSeparators } from "./index.js"

describe(`checkSeparators`, () => {
	it(`should not set error for element without underscores`, () => {
		let node = { attribs: { "class": `button` }, customDataSet: { prefixes: new Set() } } as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkSeparators(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should not set error for valid BEM classes`, () => {
		let node = {
			attribs: { "class": `button button__icon button--large` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkSeparators(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should set error for wrong element separator (single underscore)`, () => {
		let node = {
			attribs: { "class": `button_icon` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkSeparators(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Wrong element separator!`)).toBe(true)
	})

	it(`should set error for wrong modifier value separator`, () => {
		let node = {
			attribs: { "class": `button--large__invalid` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkSeparators(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Wrong modifier value separator!`)).toBe(true)
	})

	it(`should handle multiple wrong separators`, () => {
		let node = {
			attribs: { "class": `button_icon button--large__invalid` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkSeparators(node, warnings)

		expect(warnings.count).toBe(2)
		expect(node.customDataSet.errorDefs?.has(`Wrong element separator!`)).toBe(true)
		expect(node.customDataSet.errorDefs?.has(`Wrong modifier value separator!`)).toBe(true)
	})

	it(`should not set error for class with underscore but no double underscore`, () => {
		let node = {
			attribs: { "class": `my_custom_class` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkSeparators(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Wrong element separator!`)).toBe(true)
	})

	it(`should handle complex valid BEM structure`, () => {
		let node = {
			attribs: { "class": `block block__element block__element--modifier` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkSeparators(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should detect wrong separator in complex class list`, () => {
		let node = {
			attribs: { "class": `block block__element block_wrong_separator` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkSeparators(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Wrong element separator!`)).toBe(true)
	})
})
