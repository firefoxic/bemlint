import { equal } from "node:assert/strict"
import { describe, it } from "node:test"

import { generateAsciiTree } from "../lib/generateAsciiTree.js"

describe(`generateAsciiTree`, () => {
	it(`should return empty string for empty AST`, () => {
		let ast = {}
		let options = {}
		let result = generateAsciiTree(ast, options)

		equal(result, ``)
	})

	it(`should return ASCII representation of single node AST`, () => {
		let ast = {
			label: `Node 1`,
			nodes: [],
		}
		let options = {}
		let result = generateAsciiTree(ast, options)

		equal(result, `Node 1`)
	})

	it(`should return correct ASCII tree representation for complex AST`, () => {
		let ast = {
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

		equal(result, `Root
├─ Node 1
│  ├─ Node 1.1
│  └─ Node 1.2
│     ├─ Node 1.2.1
│     └─ Node 1.2.2
└─ Node 2`)
	})
})

