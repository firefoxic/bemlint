import { styleText } from "node:util"

import htmlParser from "node-html-parser"

let countBemWarning = 0

/**
 * Lint HTML content for BEM methodology compliance
 *
 * @param {string} content - The content of the HTML file.
 *
 * @returns {Object} - The result of the BEM linting.
 * @returns {number} returns.warningCount - The amount of BEM issues found.
 * @returns {Object} returns.ast - The abstract syntax tree of the parsed HTML.
 */
export function lintContent (content) {
	let htmlThree = htmlParser.parse(content)
	let ast = convertHtmlToAst(htmlThree)
	let warningCount = countBemWarning

	countBemWarning = 0

	return {
		warningCount,
		ast,
	}
}

/**
 * Converts an HTML tree to an abstract syntax tree (AST).
 *
 * @param {HTMLElement} htmlTree - The HTML tree to be converted.
 * @return {Object} The formatted AST.
 */
function convertHtmlToAst (htmlTree) {
	let ast = { nodes: [], warningCount: 0 }

	for (let node of htmlTree.childNodes) {
		if (node.nodeType !== 1) continue

		ast.label = createLabel(node)
		addClassesAsPrefixes(node)
		formatTree(node.childNodes, ast.nodes, node.customDataSet?.prefixes)
	}

	return ast
}

/**
 * Formats the tree of HTML nodes and generates an abstract syntax tree (AST) based on the given HTML nodes.
 *
 * @param {Array} htmlNodes - An array of HTML nodes.
 * @param {Array} astNodes - An array to store the generated AST nodes.
 * @param {Set} prefixes - A set of prefixes.
 */
function formatTree (htmlNodes, astNodes, prefixes = new Set) {
	for (let node of htmlNodes) {
		if (node.nodeType !== 1) continue

		node.customDataSet = { prefixes }

		addClassesAsPrefixes(node)
		checkSeparators(node)
		checkBemElement(node)
		checkBemModifier(node)

		let ast = {
			label: createLabel(node),
			nodes: [],
		}

		astNodes.push(ast)

		if (node.childNodes.length) {
			formatTree(node.childNodes, ast.nodes, node.customDataSet.prefixes)
		}
	}
}

/**
 * Adds classes as prefixes to the given node, based on the class names in the parent node.
 *
 * @param {Object} node - The node to add prefixes to.
 */
function addClassesAsPrefixes (node) {
	node.customDataSet ??= { prefixes: new Set }

	if (node.parentNode?.customDataSet?.prefixes) {
		node.customDataSet.prefixes = new Set(node.parentNode.customDataSet.prefixes)
	}

	node.classList.value.forEach((className) => {
		let isElement = className.includes(`__`)
		let isModifier = className.includes(`--`)

		if (isElement || isModifier) return

		node.customDataSet.prefixes.add(className)
	})
}

/**
 * Generates a tree label based on the given node.
 *
 * @param {Object} node - The node to generate the label tree from.
 * @return {string} The label tree generated from the node.
 */
function createLabel (node) {
	let label = styleText(`cyanBright`, node.tagName)

	if (node.id) {
		label += styleText(`yellow`, `#${node.id.replace(` `, `#`)}`)
	}

	if (node.classList.length) {
		label += styleText(`greenBright`, `.${node.classList.value.join(`.`)}`)
	}

	if (node.customDataSet?.errorDefs?.size) {
		label += ` ❌ ${styleText(`bold`, [...node.customDataSet.errorDefs.keys()].join(` `))}`
	}

	return label
}

function checkSeparators (node) {
	if (node.classList.value.join().indexOf(`_`) < 0) return

	let singleUnderscoreRegex = /^(?!.*--)(?=.*[^_]_[^_]).*$/
	let doubleModifierRegex = /--.*(__|--).*$/

	node.classList.value.forEach((classItem) => {
		if (singleUnderscoreRegex.test(classItem)) {
			setError(node.customDataSet, `Wrong element separator!`)
		}
		if (doubleModifierRegex.test(classItem)) {
			setError(node.customDataSet, `Wrong modifier value separator!`)
		}
	})
}

/**
 * Checks if the given node is a BEM element.
 *
 * @param {HTMLElement} node - The node to check.
 */
function checkBemElement (node) {
	if (!node.classList.value.join().includes(`__`)) return

	node.classList.value.forEach((classItem) => {
		let classParts = classItem.split(`__`)

		if (classParts.length > 2 && !classParts[1].includes(`--`) && !classParts[0].includes(`--`)) {
			setError(node.customDataSet, `Element of element!`)
		} else if (classParts.length > 1 && !classParts[0].includes(`--`)) {
			let prefix = classParts[0]

			if (!node.customDataSet.prefixes.has(prefix)) {
				setError(node.customDataSet, `Element outside its block!`)
			} else if (node.classList.contains(prefix)) {
				setError(node.customDataSet, `Element mixed with its block!`)
			}
		}
	})
}

/**
 * Checks if the given node has a BEM modifier.
 *
 * @param {HTMLElement} node - The node to check.
 */
function checkBemModifier (node) {
	if (node.classList.value.join().indexOf(`--`) < 0) return

	node.classList.value.forEach((classItem) => {
		if (classItem.split(`--`).length > 1) {
			let modifierPrefix = classItem.split(`--`)[0]

			if (!~node.classList.value.indexOf(modifierPrefix)) {
				setError(node.customDataSet, `Modifier without modifiable!`)
			}
		}
	})
}

/**
 * Sets an error in the provided custom data set.
 *
 * @param {object} customDataSet - The custom data set to set the error in.
 * @param {string} errorDef - The error message to set.
 */
function setError (customDataSet, errorDef) {
	countBemWarning++
	customDataSet.errorDefs ||= new Set
	customDataSet.errorDefs.add(errorDef)
}
