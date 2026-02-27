import { describe, expect, it } from "vitest"

import { addClassesAsPrefixes } from "./addClassesAsPrefixes.js"
import type { ParsedElement } from "./types.js"

describe(`addClassesAsPrefixes`, () => {
	it(`should initialize customDataSet with empty prefixes set`, () => {
		let node = { attribs: { "class": `button` }, childNodes: [] } as unknown as ParsedElement

		addClassesAsPrefixes(node)

		expect(node.customDataSet.prefixes).toBeDefined()
		expect(node.customDataSet.prefixes.has(`button`)).toBe(true)
	})

	it(`should add block class to prefixes`, () => {
		let node = {
			attribs: { "class": `button` },
			childNodes: [],
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement

		addClassesAsPrefixes(node)

		expect(node.customDataSet.prefixes.has(`button`)).toBe(true)
	})

	it(`should add multiple block classes to prefixes`, () => {
		let node = {
			attribs: { "class": `button card` },
			childNodes: [],
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement

		addClassesAsPrefixes(node)

		expect(node.customDataSet.prefixes.has(`button`)).toBe(true)
		expect(node.customDataSet.prefixes.has(`card`)).toBe(true)
	})

	it(`should not add element class to prefixes`, () => {
		let node = {
			attribs: { "class": `button__icon` },
			childNodes: [],
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement

		addClassesAsPrefixes(node)

		expect(node.customDataSet.prefixes.has(`button__icon`)).toBe(false)
	})

	it(`should not add modifier class to prefixes`, () => {
		let node = {
			attribs: { "class": `button--large` },
			childNodes: [],
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement

		addClassesAsPrefixes(node)

		expect(node.customDataSet.prefixes.has(`button--large`)).toBe(false)
	})

	it(`should inherit prefixes from parent node`, () => {
		let parentNode = { attribs: { "class": `card` }, childNodes: [] } as unknown as ParsedElement
		let childNode = { attribs: { "class": `button` }, parentNode, childNodes: [] } as unknown as ParsedElement

		addClassesAsPrefixes(parentNode)
		addClassesAsPrefixes(childNode)

		expect(childNode.customDataSet.prefixes.has(`card`)).toBe(true)
		expect(childNode.customDataSet.prefixes.has(`button`)).toBe(true)
	})

	it(`should handle mixed block and element classes`, () => {
		let node = {
			attribs: { "class": `button button__icon` },
			childNodes: [],
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement

		addClassesAsPrefixes(node)

		expect(node.customDataSet.prefixes.has(`button`)).toBe(true)
		expect(node.customDataSet.prefixes.has(`button__icon`)).toBe(false)
	})

	it(`should handle mixed block and modifier classes`, () => {
		let node = {
			attribs: { "class": `button button--large` },
			childNodes: [],
			customDataSet: { prefixes: new Set() },
		} as unknown as ParsedElement

		addClassesAsPrefixes(node)

		expect(node.customDataSet.prefixes.has(`button`)).toBe(true)
		expect(node.customDataSet.prefixes.has(`button--large`)).toBe(false)
	})
})
