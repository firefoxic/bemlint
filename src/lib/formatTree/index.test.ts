import { describe, expect, it } from "vitest"

import type { AstNode, ParsedElement, Warnings } from "../types.js"

import { formatTree } from "./index.js"

describe(`formatTree`, () => {
	it(`should handle empty nodes array`, () => {
		let htmlNodes: ParsedElement[] = []
		let astNodes: AstNode[] = []
		let warnings: Warnings = { count: 0 }

		formatTree(htmlNodes, astNodes, new Set(), warnings)

		expect(astNodes).toEqual([])
		expect(warnings.count).toBe(0)
	})

	it(`should process single node without children`, () => {
		let htmlNodes = [
			{
				tagName: `div`,
				attribs: { "class": `button` },
				childNodes: [],
			},
		] as unknown as ParsedElement[]
		let astNodes: AstNode[] = []
		let warnings: Warnings = { count: 0 }

		formatTree(htmlNodes, astNodes, new Set(), warnings)

		expect(astNodes.length).toBe(1)
		expect(astNodes[0].label).toContain(`div`)
		expect(astNodes[0].nodes).toEqual([])
	})

	it(`should process nested nodes`, () => {
		let htmlNodes = [
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
		] as unknown as ParsedElement[]
		let astNodes: AstNode[] = []
		let warnings: Warnings = { count: 0 }

		formatTree(htmlNodes, astNodes, new Set(), warnings)

		expect(astNodes.length).toBe(1)
		expect(astNodes[0].label).toContain(`div`)
		expect(astNodes[0].nodes.length).toBe(1)
		expect(astNodes[0].nodes[0].label).toContain(`button`)
	})

	it(`should skip nodes without tagName`, () => {
		let htmlNodes = [
			{ tagName: `div`, attribs: {}, childNodes: [] },
			{} as ParsedElement,
			{ tagName: `span`, attribs: {}, childNodes: [] },
		] as unknown as ParsedElement[]
		let astNodes: AstNode[] = []
		let warnings: Warnings = { count: 0 }

		formatTree(htmlNodes, astNodes, new Set(), warnings)

		expect(astNodes.length).toBe(2)
		expect(astNodes[0].label).toContain(`div`)
		expect(astNodes[1].label).toContain(`span`)
	})

	it(`should set error for invalid BEM structure`, () => {
		let htmlNodes = [
			{
				tagName: `div`,
				attribs: { "class": `button__icon` },
				customDataSet: { prefixes: new Set() },
				childNodes: [],
			},
		] as unknown as ParsedElement[]
		let astNodes: AstNode[] = []
		let warnings: Warnings = { count: 0 }

		formatTree(htmlNodes, astNodes, new Set(), warnings)

		expect(warnings.count).toBe(1)
		expect(astNodes[0].label).toContain(`Element outside its block!`)
	})

	it(`should inherit prefixes through nested structure`, () => {
		let htmlNodes = [
			{
				tagName: `div`,
				attribs: { "class": `block` },
				customDataSet: { prefixes: new Set() },
				childNodes: [
					{
						tagName: `span`,
						attribs: { "class": `block__element` },
						customDataSet: { prefixes: new Set() },
						childNodes: [],
					},
				],
			},
		] as unknown as ParsedElement[]
		let astNodes: AstNode[] = []
		let warnings: Warnings = { count: 0 }

		formatTree(htmlNodes, astNodes, new Set(), warnings)

		expect(warnings.count).toBe(0)
	})

	it(`should handle deeply nested structure`, () => {
		let htmlNodes = [
			{
				tagName: `div`,
				attribs: { "class": `root` },
				childNodes: [
					{
						tagName: `div`,
						attribs: { "class": `level1` },
						childNodes: [
							{
								tagName: `div`,
								attribs: { "class": `level2` },
								childNodes: [
									{
										tagName: `span`,
										attribs: { "class": `text` },
										childNodes: [],
									},
								],
							},
						],
					},
				],
			},
		] as unknown as ParsedElement[]
		let astNodes: AstNode[] = []
		let warnings: Warnings = { count: 0 }

		formatTree(htmlNodes, astNodes, new Set(), warnings)

		expect(astNodes.length).toBe(1)
		expect(astNodes[0].nodes.length).toBe(1)
		expect(astNodes[0].nodes[0].nodes.length).toBe(1)
		expect(astNodes[0].nodes[0].nodes[0].nodes.length).toBe(1)
	})

	it(`should handle multiple sibling nodes`, () => {
		let htmlNodes = [
			{ tagName: `div`, attribs: { "class": `item1` }, childNodes: [] },
			{ tagName: `div`, attribs: { "class": `item2` }, childNodes: [] },
			{ tagName: `div`, attribs: { "class": `item3` }, childNodes: [] },
		] as unknown as ParsedElement[]
		let astNodes: AstNode[] = []
		let warnings: Warnings = { count: 0 }

		formatTree(htmlNodes, astNodes, new Set(), warnings)

		expect(astNodes.length).toBe(3)
	})
})
