import { describe, expect, it } from "vitest"

import type { AstNode } from "../types.js"

import { generateAsciiTree } from "./index.js"

describe(`generateAsciiTree`, () => {
	it(`should return empty string for empty AST`, () => {
		let ast: AstNode = {} as AstNode
		let options = {}
		let result = generateAsciiTree(ast, options)

		expect(result).toBe(``)
	})

	it(`should return ASCII representation of single node AST`, () => {
		let ast: AstNode = {
			label: `Node 1`,
			nodes: [],
		}
		let options = {}
		let result = generateAsciiTree(ast, options)

		expect(result).toBe(`Node 1`)
	})

	it(`should return correct ASCII tree representation for complex AST`, () => {
		let ast: AstNode = {
			label: `Root`,
			nodes: [
				{
					label: `Node 1`,
					nodes: [
						{
							label: `Node 1.1`,
							nodes: [],
						},
						{
							label: `Node 1.2`,
							nodes: [
								{
									label: `Node 1.2.1`,
									nodes: [],
								},
								{
									label: `Node 1.2.2`,
									nodes: [],
								},
							],
						},
					],
				},
				{
					label: `Node 2`,
					nodes: [],
				},
			],
		}
		let options = {}
		let result = generateAsciiTree(ast, options)

		expect(result).toBe(`Root
├─ Node 1
│  ├─ Node 1.1
│  └─ Node 1.2
│     ├─ Node 1.2.1
│     └─ Node 1.2.2
└─ Node 2`)
	})
})
