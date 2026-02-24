import { describe, expect, it } from "vitest"

import type { ParsedElement, Warnings } from "../types.js"

import { checkBemModifier } from "./index.js"

describe(`checkBemModifier`, () => {
	it(`should not set error for element without BEM classes`, () => {
		let node = { attribs: { "class": `simple-class` }, customDataSet: { prefixes: new Set() } } as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemModifier(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should not set error for valid modifier`, () => {
		let node = {
			attribs: { "class": `button button--large` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemModifier(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should set error for modifier without modifiable entity`, () => {
		let node = {
			attribs: { "class": `button--large` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemModifier(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Modifier without modifiable!`)).toBe(true)
	})

	it(`should not set error for multiple valid modifiers`, () => {
		let node = {
			attribs: { "class": `button button--large button--primary` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemModifier(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should set error for multiple modifiers without modifiable`, () => {
		let node = {
			attribs: { "class": `button--large button--primary` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemModifier(node, warnings)

		expect(warnings.count).toBe(2)
		expect(node.customDataSet.errorDefs?.has(`Modifier without modifiable!`)).toBe(true)
	})

	it(`should handle modifier on element`, () => {
		let node = {
			attribs: { "class": `button button__icon button__icon--large` },
			customDataSet: { prefixes: new Set([`button`]) },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemModifier(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should set error for element modifier without base element`, () => {
		let node = {
			attribs: { "class": `button button__icon--large` },
			customDataSet: { prefixes: new Set([`button`]) },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemModifier(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Modifier without modifiable!`)).toBe(true)
	})

	it(`should handle mixed valid and invalid modifiers`, () => {
		let node = {
			attribs: { "class": `button button--large button--primary card--featured` },
			customDataSet: { prefixes: new Set([`button`]) },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemModifier(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Modifier without modifiable!`)).toBe(true)
	})
})
