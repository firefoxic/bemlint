import { describe, expect, it } from "vitest"

import { setError } from "./setError.ts"
import type { ParsedElement, Warnings } from "./types.ts"

describe(`setError`, () => {
	it(`should increment warnings count`, () => {
		let warnings: Warnings = { count: 0 }
		let node = createNode()

		setError(warnings, node, `Test error`, `bem/test`, `block__element`)

		expect(warnings.count).toBe(1)
	})

	it(`should increment warnings count multiple times`, () => {
		let warnings: Warnings = { count: 0 }
		let node = createNode()

		setError(warnings, node, `Error 1`, `bem/test`, `block__element`)
		setError(warnings, node, `Error 2`, `bem/test`, `block__element`)
		setError(warnings, node, `Error 3`, `bem/test`, `block__element`)

		expect(warnings.count).toBe(3)
	})

	it(`should add error to customDataSet.errorDefs`, () => {
		let warnings: Warnings = { count: 0 }
		let node = createNode()

		setError(warnings, node, `Test error`, `bem/test`, `block__element`)

		expect(node.customDataSet.errorDefs).toBeDefined()
		expect(node.customDataSet.errorDefs?.has(`Test error`)).toBe(true)
	})

	it(`should add multiple errors to customDataSet.errorDefs`, () => {
		let warnings: Warnings = { count: 0 }
		let node = createNode()

		setError(warnings, node, `Error 1`, `bem/test`, `block__element`)
		setError(warnings, node, `Error 2`, `bem/test`, `block__element`)
		setError(warnings, node, `Error 3`, `bem/test`, `block__element`)

		expect(node.customDataSet.errorDefs?.size).toBe(3)
		expect(node.customDataSet.errorDefs?.has(`Error 1`)).toBe(true)
		expect(node.customDataSet.errorDefs?.has(`Error 2`)).toBe(true)
		expect(node.customDataSet.errorDefs?.has(`Error 3`)).toBe(true)
	})

	it(`should not duplicate identical errors`, () => {
		let warnings: Warnings = { count: 0 }
		let node = createNode()

		setError(warnings, node, `Same error`, `bem/test`, `block__element`)
		setError(warnings, node, `Same error`, `bem/test`, `block__element`)
		setError(warnings, node, `Same error`, `bem/test`, `block__element`)

		expect(warnings.count).toBe(3)
		expect(node.customDataSet.errorDefs?.size).toBe(1)
		expect(node.customDataSet.errorDefs?.has(`Same error`)).toBe(true)
	})

	it(`should initialize errorDefs if not present`, () => {
		let warnings: Warnings = { count: 0 }
		let node = createNode()
		delete (node.customDataSet as Partial<typeof node.customDataSet>).errorDefs

		setError(warnings, node, `Test error`, `bem/test`, `block__element`)

		expect(node.customDataSet.errorDefs).toBeDefined()
		expect(node.customDataSet.errorDefs?.has(`Test error`)).toBe(true)
	})
})

function createNode (): ParsedElement {
	return {
		tagName: `div`,
		customDataSet: { prefixes: new Set() },
	} as ParsedElement
}
