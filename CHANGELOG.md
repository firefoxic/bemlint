<!-- markdownlint-disable MD024 -->
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com), and this project adheres to [Semantic Versioning](https://semver.org).

## [Unreleased]

## [6.0.1] — 2026–02–24

### Fixed

- For convenient use of the Node.js API with TypeScript, the package now comes with type declarations.

## [6.0.0] — 2025–09–17

### Changed

- **Complete transition from the Gulp plugin to a standalone CLI tool.**
- The package name has now been changed from `gulp-html-bemlinter` to `@firefoxic/bemlint` (the old package is still available but is now deprecated).
- The package now exports `bemlint` (asynchronous function).
- Stream processing has been replaced with file system operations.
- The package now provides a command line interface `bemlint`:
	- works with glob patterns — `bemlint dist/**/*.html`,
	- works with directories — `bemlint dist` (directories are pre-converted to glob patterns: `<dir>` → `<dir>/**/*.html`),
	- supports individual files — `bemlint dist/about.html`,
	- supports multiple inputs — `bemlint dist/index.html dist/blog/**/*.html`,
	- ignores `**/node_modules/**/*`,
	- exits with correct codes: `0` for success, `1` for detected BEM issues.
- See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for detailed instructions on migrating from `gulp-html-bemlinter` to `@firefoxic/bemlint`.

## [5.0.1] — 2024–11–08

### Fixed

- Searching for elements outside their blocks now correctly recognizes the DOM tree hierarchy and considers orphaned elements as errors, including when there are matching blocks in neighboring branches of the DOM tree.

## [5.0.0] — 2024–10–30

### Changed

- The minimum required `node.js` version has been increased to `20.13.0`, except for version `21`.

## [4.0.0] — 2024–05–10

### Changed

- The following separators are now considered invalid:
	- single underscores that are not separators of the name and value of modifiers;
	- double underscores within modifiers;
	- double hyphens within modifiers.
- For better compatibility with other tools, the project is now published under [the MIT license](./LICENSE.md).

### Fixed

- Readability of the BEM tree. The tree is now painted in different colors:
	- tags — blue
	- identifiers — yellow
	- classes — green
	- error texts — white/black (depending on color scheme)

## [3.0.1] — 2023–12–04

### Fixed

- The coloring terminal output.
- The informative of the error output.

## [3.0.0] — 2023–11–23

### Changed

- Mixing an element to its own block is now considered an error.

## [2.1.4] — 2023–05–12

### Fixed

- The output in the terminal is no longer clogged with success messages.

## [2.1.3] — 2023–03–20

### Fixed

- File lists to ignore.

## [2.1.2] — 2022–09–22

No significant changes

## [2.1.1] — 2022–08–14

### Fixed

- A bug that was present since v2.0.0 and dropped all BEM linting.

## [2.1.0] — 2022–08–14

### Added

- The result of linting an invalid bem-tree now has an error status.

## [2.0.3] — 2022–08–14

### Fixed

- The versions in this changelog are now links to comparisons with previous versions.

## [2.0.2] — 2022–08–13

### Fixed

- The result styling.

## [2.0.1] — 2022–08–13

### Added

- Badges for tests, license and vulnerability counter.

## [2.0.0] — 2022–08–12

### Changed

- The project has been converted to ESM.

## [1.2.3] — 2022–07–27

### Fixed

- The project name has been updated in all files.
- The report styling.

## [1.2.0] — 2022–07–26

### Fixed

- `page` block elements on the `html` tag are no longer treated as “element outside of its block” errors.

## [1.1.0] — 2022–07–26

### Fixed

- The elements of the elements, such as `block__elem1__elem2`, are now also flagged as a bem naming error (thanks to [@SampetovaN](https://github.com/SampetovaN)).

## [1.0.0] — 2022–07–26

### Added

- Basic functionality via a fork of the [gulp-html-bem-validator](https://github.com/dDenysS/gulp-html-bem-validator/) project.

[Unreleased]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v6.0.1...HEAD
[6.0.1]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v6.0.0...v6.0.1
[6.0.0]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v5.0.1...v6.0.0
[5.0.1]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v5.0.0...v5.0.1
[5.0.0]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v4.0.0...v5.0.0
[4.0.0]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v3.0.1...v4.0.0
[3.0.1]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v2.1.4...v3.0.0
[2.1.4]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v2.1.2...v2.1.3
[2.1.2]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v2.0.3...v2.1.0
[2.0.3]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v1.2.3...v2.0.0
[1.2.3]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v1.2.0...v1.2.3
[1.2.0]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/firefoxic/gulp-html-bemlinter/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/firefoxic/gulp-html-bemlinter/releases/tag/v1.0.0
