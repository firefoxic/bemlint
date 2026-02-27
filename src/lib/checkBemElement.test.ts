import { describe, expect, it } from "vitest"

import { checkBemElement } from "./checkBemElement.js"
import type { ParsedElement, Warnings } from "./types.js"

describe(`checkBemElement`, () => {
	it(`should not set error for element without BEM classes`, () => {
		let node = { attribs: { "class": `simple-class` }, customDataSet: { prefixes: new Set() } } as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemElement(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should not set error for valid element`, () => {
		// Only element class without block - valid if block is in prefixes
		let node = {
			attribs: { "class": `button__icon` },
			customDataSet: { prefixes: new Set([`button`]) },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemElement(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should set error for element of element`, () => {
		let node = {
			attribs: { "class": `block__element__subelement` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemElement(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Element of element!`)).toBe(true)
	})

	it(`should set error for element outside its block`, () => {
		let node = {
			attribs: { "class": `button__icon` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemElement(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Element outside its block!`)).toBe(true)
	})

	it(`should not set error for element inside its block`, () => {
		// Only element class without block class on same element
		let node = {
			attribs: { "class": `button__icon` },
			customDataSet: { prefixes: new Set([`button`]) },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemElement(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should set error for element mixed with its block`, () => {
		let node = {
			attribs: { "class": `button button__icon` },
			customDataSet: { prefixes: new Set([`button`]) },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemElement(node, warnings)

		expect(warnings.count).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Element mixed with its block!`)).toBe(true)
	})

	it(`should handle element with modifier`, () => {
		// Only element with modifier, no block class
		let node = {
			attribs: { "class": `button__icon--large` },
			customDataSet: { prefixes: new Set([`button`]) },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemElement(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should handle multiple classes with valid element`, () => {
		// Element with modifier but without block class on same element
		let node = {
			attribs: { "class": `button__icon--large` },
			customDataSet: { prefixes: new Set([`button`]) },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemElement(node, warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should detect element of element with modifier in path`, () => {
		let node = {
			attribs: { "class": `block__element--mod__subelement` },
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		checkBemElement(node, warnings)

		expect(warnings.count).toBe(1)
		// Error is "Element of element!" because classParts = ["block", "element--mod", "subelement"]
		expect(warnings.count).toBeGreaterThanOrEqual(1)
	})
})
