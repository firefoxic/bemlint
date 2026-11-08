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
	sourceCodeLocation?: {
		startLine: number,
		startCol: number,
	} | null,
	attribs: Record<string, string>,
	attrs: Array<{ name: string, value: string }>,
	childNodes: ParsedElement[],
	parentNode?: ParsedElement,
}

export type Warnings = {
	count: number,
	diagnostics?: LintDiagnostic[],
}

export type LintContentResult = {
	warningCount: number,
	diagnostics: LintDiagnostic[],
	ast: AstNode,
}

export type FileLintSuccess = {
	filePath: string,
	warningCount: number,
	diagnostics: LintDiagnostic[],
	ast: LintContentResult[`ast`],
}

export type FileLintError = {
	filePath: string,
	code: `file-read`,
	errorObj: Error,
}

export type FileLintResult = FileLintSuccess | FileLintError

export type LintFileResult = FileLintResult | null

export type BemlintResult = {
	checkedFileCount: number,
	results: FileLintResult[],
}

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

export type BemClassParts = {
	block: string,
	element?: string,
	modifier?: string,
	modifierValue?: string,
}

export type BemClassNameError = `empty-name` | `element-separator` | `modifier-separator` | `nested-element`

export type BemClassNameResult = { parts: BemClassParts } | { error: BemClassNameError }

export type LintDiagnostic = {
	ruleId: string,
	message: string,
	className: string,
	location?: {
		line: number,
		column: number,
	},
}

export type AstNode = {
	label?: string,
	nodes: AstNode[],
	warningCount?: number,
}
