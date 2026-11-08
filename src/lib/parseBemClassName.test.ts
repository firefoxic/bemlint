import { describe, expect, it } from "vitest"

import { parseBemClassName } from "./parseBemClassName.ts"

describe(`parseBemClassName`, () => {
	it(`should parse a block name`, () => {
		expect(parseBemClassName(`block-name`)).toEqual({
			parts: { block: `block-name` },
		})
	})

	it(`should parse an element name`, () => {
		expect(parseBemClassName(`block-name__element-name`)).toEqual({
			parts: { block: `block-name`, element: `element-name` },
		})
	})

	it(`should parse a block modifier`, () => {
		expect(parseBemClassName(`block--modifier`)).toEqual({
			parts: { block: `block`, modifier: `modifier` },
		})
	})

	it(`should parse a modifier value`, () => {
		expect(parseBemClassName(`block__element--modifier_value`)).toEqual({
			parts: {
				block: `block`,
				element: `element`,
				modifier: `modifier`,
				modifierValue: `value`,
			},
		})
	})

	it(`should leave case and non-separator characters unrestricted`, () => {
		expect(parseBemClassName(`Block.name__Element`)).toEqual({
			parts: { block: `Block.name`, element: `Element` },
		})
	})

	it.each([
		[``, `empty-name`],
		[`__element`, `empty-name`],
		[`block__`, `empty-name`],
		[`block--`, `empty-name`],
		[`block--_value`, `empty-name`],
		[`block--modifier_`, `empty-name`],
		[`block____element`, `nested-element`],
		[`block__element__subelement`, `nested-element`],
		[`block_name`, `element-separator`],
		[`block_name--modifier`, `element-separator`],
		[`block--modifier__value`, `modifier-separator`],
		[`block__element--modifier__subelement`, `nested-element`],
		[`block--modifier--secondary`, `modifier-separator`],
		[`block--modifier_value_extra`, `modifier-separator`],
	])(`should reject malformed class name %s`, (className, error) => {
		expect(parseBemClassName(className)).toEqual({ error })
	})
})
