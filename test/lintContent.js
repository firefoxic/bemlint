import { equal } from "node:assert/strict"
import { readFileSync } from "node:fs"
import { describe, it } from "node:test"

import { lintContent } from "../lib/lintContent.js"

describe(`bemlint CLI`, () => {
	it(`should fail markup with an incorrect BEM tree`, () => {
		let html = readFileSync(
			new URL(`./fixtures/error-complex.html`, import.meta.url),
		)
		let { warningCount } = lintContent(html.toString())

		equal(warningCount, 6)
	})
	it(`should pass markup with a correct BEM tree`, () => {
		let html = readFileSync(
			new URL(`./fixtures/valid.html`, import.meta.url),
		)
		let { warningCount } = lintContent(html.toString())

		equal(warningCount, 0)
	})
})

describe(`BEM tree`, () => {
	it(`should be correct`, () => {
		let html = readFileSync(
			new URL(`./fixtures/valid.html`, import.meta.url),
		)
		let { warningCount } = lintContent(html.toString())

		equal(warningCount, 0)
	})
	it(`should not contain elements outside their blocks`, () => {
		let html = readFileSync(
			new URL(
				`./fixtures/error-in-element-without-block.html`,
				import.meta.url,
			),
		)
		let { warningCount } = lintContent(html.toString())

		equal(warningCount, 1)
	})
	it(`should not conatain modifiers without modifiable entity`, () => {
		let html = readFileSync(
			new URL(`./fixtures/error-in-modifiers.html`, import.meta.url),
		)
		let { warningCount } = lintContent(html.toString())

		equal(warningCount, 2)
	})
	it(`should not contain elements of elements`, () => {
		let html = readFileSync(
			new URL(
				`./fixtures/error-in-element-of-element.html`,
				import.meta.url,
			),
		)
		let { warningCount } = lintContent(html.toString())

		equal(warningCount, 1)
	})
	it(`should not contain mixes of elements with their blocks`, () => {
		let html = readFileSync(
			new URL(
				`./fixtures/error-in-element-mixed-with-block.html`,
				import.meta.url,
			),
		)
		let { warningCount } = lintContent(html.toString())

		equal(warningCount, 1)
	})
	it(`should not contain wrong separators`, () => {
		let html = readFileSync(
			new URL(`./fixtures/error-in-separators.html`, import.meta.url),
		)
		let { warningCount } = lintContent(html.toString())

		equal(warningCount, 3)
	})
	it(`should not contain any errors`, () => {
		let html = readFileSync(
			new URL(`./fixtures/error-complex.html`, import.meta.url),
		)
		let { warningCount } = lintContent(html.toString())

		equal(warningCount, 6)
	})
})
