import { describe, expect, it } from "vitest"

import type { CustomDataSet, Warnings } from "../types.js"

import { setError } from "./index.js"

describe(`setError`, () => {
	it(`should increment warnings count`, () => {
		let warnings: Warnings = { count: 0 }
		let customDataSet: CustomDataSet = { prefixes: new Set() }

		setError(warnings, customDataSet, `Test error`)

		expect(warnings.count).toBe(1)
	})

	it(`should increment warnings count multiple times`, () => {
		let warnings: Warnings = { count: 0 }
		let customDataSet: CustomDataSet = { prefixes: new Set() }

		setError(warnings, customDataSet, `Error 1`)
		setError(warnings, customDataSet, `Error 2`)
		setError(warnings, customDataSet, `Error 3`)

		expect(warnings.count).toBe(3)
	})

	it(`should add error to customDataSet.errorDefs`, () => {
		let warnings: Warnings = { count: 0 }
		let customDataSet: CustomDataSet = { prefixes: new Set() }

		setError(warnings, customDataSet, `Test error`)

		expect(customDataSet.errorDefs).toBeDefined()
		expect(customDataSet.errorDefs?.has(`Test error`)).toBe(true)
	})

	it(`should add multiple errors to customDataSet.errorDefs`, () => {
		let warnings: Warnings = { count: 0 }
		let customDataSet: CustomDataSet = { prefixes: new Set() }

		setError(warnings, customDataSet, `Error 1`)
		setError(warnings, customDataSet, `Error 2`)
		setError(warnings, customDataSet, `Error 3`)

		expect(customDataSet.errorDefs?.size).toBe(3)
		expect(customDataSet.errorDefs?.has(`Error 1`)).toBe(true)
		expect(customDataSet.errorDefs?.has(`Error 2`)).toBe(true)
		expect(customDataSet.errorDefs?.has(`Error 3`)).toBe(true)
	})

	it(`should not duplicate identical errors`, () => {
		let warnings: Warnings = { count: 0 }
		let customDataSet: CustomDataSet = { prefixes: new Set() }

		setError(warnings, customDataSet, `Same error`)
		setError(warnings, customDataSet, `Same error`)
		setError(warnings, customDataSet, `Same error`)

		expect(warnings.count).toBe(3)
		expect(customDataSet.errorDefs?.size).toBe(1)
		expect(customDataSet.errorDefs?.has(`Same error`)).toBe(true)
	})

	it(`should initialize errorDefs if not present`, () => {
		let warnings: Warnings = { count: 0 }
		let customDataSet: CustomDataSet = { prefixes: new Set() }
		delete (customDataSet as Partial<CustomDataSet>).errorDefs

		setError(warnings, customDataSet, `Test error`)

		expect(customDataSet.errorDefs).toBeDefined()
		expect(customDataSet.errorDefs?.has(`Test error`)).toBe(true)
	})
})
