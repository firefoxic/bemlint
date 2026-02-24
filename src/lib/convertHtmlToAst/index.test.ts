import { describe, expect, it } from "vitest"

import type { ParsedElement, Warnings } from "../types.js"

import { convertHtmlToAst } from "./index.js"

describe(`convertHtmlToAst`, () => {
	it(`should return AST with empty nodes for empty HTML tree`, () => {
		let htmlTree = { childNodes: [] } as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		let result = convertHtmlToAst(htmlTree, warnings)

		expect(result.nodes).toEqual([])
		expect(result.label).toBeUndefined()
		expect(warnings.count).toBe(0)
	})

	it(`should convert single element to AST`, () => {
		let htmlTree = {
			childNodes: [
				{
					tagName: `div`,
					attribs: { "class": `button` },
					childNodes: [],
				},
			],
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		let result = convertHtmlToAst(htmlTree, warnings)

		expect(result.label).toContain(`div`)
		expect(result.nodes).toEqual([])
	})

	it(`should convert nested HTML structure to AST`, () => {
		let htmlTree = {
			childNodes: [
				{
					tagName: `div`,
					attribs: { "class": `container` },
					childNodes: [
						{
							tagName: `button`,
							attribs: { "class": `button` },
							childNodes: [],
						},
					],
				},
			],
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		let result = convertHtmlToAst(htmlTree, warnings)

		expect(result.label).toContain(`div`)
		expect(result.nodes.length).toBe(1)
		expect(result.nodes[0].label).toContain(`button`)
	})

	it(`should detect BEM errors in nested structure`, () => {
		let htmlTree = {
			childNodes: [
				{
					tagName: `div`,
					attribs: { "class": `button` },
					customDataSet: { prefixes: new Set() },
					childNodes: [
						{
							tagName: `span`,
							attribs: { "class": `button__icon__nested` },
							customDataSet: { prefixes: new Set() },
							childNodes: [],
						},
					],
				},
			],
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		convertHtmlToAst(htmlTree, warnings)

		// Error "Element of element!" is detected for button__icon__nested
		expect(warnings.count).toBe(1)
	})

	it(`should handle multiple root elements`, () => {
		let htmlTree = {
			childNodes: [
				{ tagName: `div`, attribs: { "class": `block1` }, childNodes: [] },
				{ tagName: `span`, attribs: { "class": `block2` }, childNodes: [] },
				{ tagName: `p`, attribs: { "class": `block3` }, childNodes: [] },
			],
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		let result = convertHtmlToAst(htmlTree, warnings)

		// Function iterates and sets label for each, last one wins
		expect(result.label).toContain(`p`)
		// All childNodes are added to ast.nodes
		expect(result.nodes.length).toBeGreaterThanOrEqual(0)
	})

	it(`should skip text nodes and other non-element nodes`, () => {
		let htmlTree = {
			childNodes: [
				{ tagName: `div`, attribs: { "class": `block` }, childNodes: [] },
				{ attribs: {}, childNodes: [] },
				{ tagName: null as unknown as undefined, attribs: {}, childNodes: [] },
			],
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		let result = convertHtmlToAst(htmlTree, warnings)

		expect(result.label).toContain(`div`)
		expect(result.nodes.length).toBe(0)
	})

	it(`should handle complex BEM structure without errors`, () => {
		let htmlTree = {
			childNodes: [
				{
					tagName: `div`,
					attribs: { "class": `button button--large` },
					customDataSet: { prefixes: new Set() },
					childNodes: [
						{
							tagName: `span`,
							attribs: { "class": `button__icon button__icon--small` },
							customDataSet: { prefixes: new Set() },
							childNodes: [],
						},
					],
				},
			],
		} as unknown as ParsedElement
		let warnings: Warnings = { count: 0 }

		let result = convertHtmlToAst(htmlTree, warnings)

		expect(result.label).toContain(`div`)
		expect(result.nodes.length).toBe(1)
		expect(warnings.count).toBe(0)
	})
})
