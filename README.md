# bemlint

[![License: MIT][license-image]][license-url]
[![Changelog][changelog-image]][changelog-url]
[![NPM version][npm-image]][npm-url]
[![Test Status][test-image]][test-url]

This CLI tool validates your HTML markup against [BEM methodology](https://en.bem.info/methodology).

<picture>
	<source srcset="https://raw.githubusercontent.com/firefoxic/bemlint/main/example/dark.webp" media="(prefers-color-scheme: dark)">
	<img src="https://raw.githubusercontent.com/firefoxic/bemlint/main/example/light.webp" alt="Example of html tree view output to the terminal indicating inconsistencies with the BEM methodology.">
</picture>

Check [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) if upgrading from `gulp-html-bemlinter`.

## Installation

### Globally

```shell
pnpm add -g @firefoxic/bemlint
```

### Locally

```shell
pnpm add -D @firefoxic/bemlint
```

## Usage

`bemlint` is invoked via the command line:

- with globally installation:

	```shell
	bemlint <inputs>
	```

- with locally installation (in a project):

	```shell
	pnpm exec bemlint <inputs>
	```

- without installation:

	```shell
	pnpm dlx @firefoxic/bemlint <inputs>
	```

For brevity, the examples below will use the global installation variant. Expand each of them for your specific case.

### Linting variants

- Lint a single file

	```shell
	bemlint dist/index.html
	```

- Lint multiple files with glob patterns

	```shell
	bemlint src/**/*.html
	```

- Lint all HTML files in a directory

	```shell
	bemlint dist/blog
	```

- Specify multiple inputs

	```shell
	bemlint dist/about.html dest/blog
	```

## Understanding results

### ✅ No issues found

```shell
$ bemlint valid.html
# No output, silently exit with code 0
$ echo $? # or $status in fish
0
```

### ❌ BEM issues found

```shell
$ bemlint dest/problematic.html

HTML
└─ BODY
   └─ DIV.card
      ├─ H1.card__title
      └─ DIV.other__element ❌ Element outside its block!

File: dest/problematic.html
bemlint: 1 issue found!

$ echo $?
1
```

## What gets checked

Currently, bemlint only supports “two-dashes” BEM notation:

- ✅ Proper BEM naming — `.block-name__elem-name--mod-name_mod-value`

The following are considered errors:

- ❌ Elements outside their blocks — `.block__elem:not(.block *)`
- ❌ Elements mixed with their blocks — `.block.block__element`
- ❌ Elements of elements — `.block__elem__sub-elem`
- ❌ Modifiers without base entity — `.block--mod-name:not(.block)`
- ❌ Wrong element separators — `block-name_elem-name`
- ❌ Wrong modifier value separators — `block--mod-name__mod-value`

## Common use cases

### In package.json scripts (with installation as a dependency)

```json
{
	"scripts": {
		"build": "...",
		"prelint:bem": "node --run build",
		"lint:bem": "bemlint \"dist/**/*.html\""
	}
}
```

### In CI/CD (without installation as a dependency)

```yaml
- name: Check BEM compliance
  run: pnpm dlx @firefoxic/bemlint "dist/**/*.html"
```

Happy BEM linting! 🎉

[license-url]: https://github.com/firefoxic/bemlint/blob/main/LICENSE.md
[license-image]: https://img.shields.io/badge/License-MIT-limegreen.svg

[changelog-url]: https://github.com/firefoxic/bemlint/blob/main/CHANGELOG.md
[changelog-image]: https://img.shields.io/badge/CHANGELOG-md-limegreen

[npm-url]: https://www.npmjs.com/package/@firefoxic/bemlint
[npm-image]: https://img.shields.io/npm/v/%40firefoxic%2Fbemlint?logo=npm&color=limegreen

[test-url]: https://github.com/firefoxic/bemlint/actions
[test-image]: https://github.com/firefoxic/bemlint/actions/workflows/test.yaml/badge.svg?branch=main
