import type { Element } from "parse5"

declare module "parse5" {
	interface Element {
		customDataSet: CustomDataSet,
	}
}

export type CustomDataSet = {
	prefixes: Set<string>,
	errorDefs?: Set<string>,
}

export type ParsedElement = Element & {
	customDataSet: CustomDataSet,
	name: string,
	tagName: string,
	attribs: Record<string, string>,
	attrs: Array<{ name: string, value: string }>,
	childNodes: ParsedElement[],
	parentNode?: ParsedElement,
}

export type Warnings = {
	count: number,
}

export type LintContentResult = {
	warningCount: number,
	ast: AstNode,
}

export type FileLintSuccess = {
	filePath: string,
	warningCount: number,
	ast: LintContentResult[`ast`],
}

export type FileLintError = {
	filePath: string,
	errorObj: Error,
}

export type FileLintResult = FileLintSuccess | FileLintError | null

export type AsciiTreeOptions = {
	prefix?: string,
	suffix?: string,
	postfix?: string,
}

export type Separators = {
	element: string,
	modifier: string,
	modifierValue: string,
}

export type AstNode = {
	label?: string,
	nodes: AstNode[],
	warningCount?: number,
}
