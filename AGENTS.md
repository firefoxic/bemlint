# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Commands

All tasks go through the `Makefile` — read it for the current list of targets and their variables (`make help` prints the same list). It prepends `node_modules/.bin` to `PATH`, so bare `vitest`/`oxlint`/`tsc` work inside targets, and flags or a file path are passed as make variables rather than by invoking the tools directly.

The pre-commit hook lints staged `.js`/`.ts` files and runs `vitest run --changed` against a stashed working tree.

## Architecture

CLI-only linter that reports BEM violations as a colored ASCII tree of the HTML document.

Data flow: [cli.ts](src/bin/cli.ts) (arg parsing, `--help`/`--version`, error → exit 1) → [bemlint.ts](src/lib/bemlint.ts) (public API entry, also the package `exports` target) → [resolvePatterns.ts](src/lib/resolvePatterns.ts) (directories → `dir/**/*.html`) → `node:fs/promises` `glob` → [lintFile.ts](src/lib/lintFile.ts) (read, returns `null` when clean) → [lintContent.ts](src/lib/lintContent.ts) (parse5 with the htmlparser2 tree adapter) → [convertHtmlToAst.ts](src/lib/convertHtmlToAst.ts) → [formatTree.ts](src/lib/formatTree.ts) → [reportFileResult.ts](src/lib/reportFileResult.ts) (prints via `generateAsciiTree`, sets `process.exitCode = 1`).

Two pieces of shared mutable state carry the whole check, both threaded through the recursive `formatTree` walk:

- **`warnings: { count }`** — a single object created in `lintContent`, incremented by [setError.ts](src/lib/setError.ts) from anywhere in the tree. It is the file's issue count.
- **`node.customDataSet`** — attached to every parse5 element (the `parse5` `Element` interface is augmented in [types.ts](src/lib/types.ts)). It holds `prefixes` (the set of ancestor **block** names, copied down from the parent by [addClassesAsPrefixes.ts](src/lib/addClassesAsPrefixes.ts), which skips classes containing `__`/`--`) and `errorDefs` (messages for this node).

`prefixes` is what makes "element outside its block" detectable: [checkBemElement.ts](src/lib/checkBemElement.ts) asks whether the class prefix before `__` is present in the ancestors' block set. Because of this, checks must run **before** [createLabel.ts](src/lib/createLabel.ts) for the same node — the label bakes in the `❌` suffix from `errorDefs`, and there is no second pass.

The three checks — [checkSeparators.ts](src/lib/checkSeparators.ts), `checkBemElement.ts`, [checkBemModifier.ts](src/lib/checkBemModifier.ts) — are the extension point for new rules; each takes `(node, warnings)` and calls `setError`.

Separators live in [constants.ts](src/lib/constants.ts) and are currently hardcoded to the "two-dashes" notation (`__`, `--`, `_`). Making them configurable is a planned feature, spec'd in [raw/feature-bem-notation-presets.md](raw/feature-bem-notation-presets.md); note that `checkSeparators` uses literal regexes rather than the constants, so it needs rewriting for that work.

`getVersion()` in the CLI resolves `../../package.json` via `createRequire` — that path is relative to the built `dist/bin/cli.js`, so it breaks if the build layout depth changes.

## Conventions

The style is enforced by `@firefoxic/oxlint-config` and matters when writing new files:

- one exported function per file, file named after it, colocated `*.test.ts`
- JSDoc with `@param {Type}` / `@returns {Type}` on every exported function
- **tabs** for indentation; `let` (not `const`) for locals; backtick string literals everywhere *except* import specifiers, which use double quotes
- Stroustrup braces — `catch` / `else` start on their own line
- relative imports carry the `.js` extension (`moduleResolution: nodenext`); type-only imports use `import type`
- `isolatedDeclarations: true`, so every exported binding needs an explicit return/value type

Tests use vitest with HTML fixtures in [fixtures/](fixtures/) resolved via `new URL("../../fixtures/...", import.meta.url)`; tests that need to write files use `mkdtemp` in `os.tmpdir()` and clean up in `finally`. Coverage is expected at 100% for `src/**` (excluding `types.ts`).

## Prose typography

Prose binds function words to their neighbours with a non-breaking space (`U+00A0`), so that none of them is left dangling at the end of a line — the point of the whole convention is comfortable reading. This holds for every Markdown file in the repository, [README.md](README.md) and [CHANGELOG.md](CHANGELOG.md) alike, and for commit messages as well. It does **not** hold inside the code: JSDoc and ordinary comments keep plain spaces, because linters object to irregular whitespace characters.

Bind to the word that *follows*:

- every article, preposition, conjunction and particle, however long it is — `an`, `into`, `under`, `through`, `because`, `whereas` are as much part of the rule as `a`, `of` or `and`;
- `not`, always, since cut off from what it negates it says nothing;
- every number, in digits or spelled out, to what it counts or measures: 22 kilo, 12 icons. A number that trails its word instead binds backwards, as a date does: April 2, 2012.

Bind to the word *before*: an em dash, so that it never starts a line. The name of a work stays in one piece the same way, whatever it is made of — Keep a Changelog, Semantic Versioning.

Verbs stay free, however short they are: `is`, `can`, `do` and `does` are bound to nothing. An auxiliary may therefore end a line while its `not` leaves for the next one together with the verb being negated — earlier revisions bound `do` and `does` to a following `not`, which is the same pair tied the wrong way round.

One case is still unsettled: `no`. It is left free everywhere for now, since it can stand with nothing to attach to. The one exception is `no longer`: a single adverb spelled in two words, it never splits. More generally, a particle sometimes belongs to the preceding word rather than the following one — when that is clearly the case, follow the meaning.

`make prose` applies all of this to every Markdown file in the repository, `LICENSE.md` aside, since a license is quoted verbatim. `make verify` runs the same pass as `make prose-check`, which writes nothing and fails on the first file left unbound. The script ([scripts/bind-prose.js](scripts/bind-prose.js)) is a helper, not an oracle: it cannot tell a conjunction from a pronoun, so both the pairs it must leave alone and the names it keeps whole are lists inside it. Read the diff it produces, and when meaning disagrees with the script, the meaning wins — teach it the exception, or the next run undoes yours.

## Commit messages

The subject line is one imperative sentence, capitalized, with no trailing period and **no conventional-commits prefix** — write `Fix the build target`, never `fix:`, `chore(build):` or the like. Wrap code identifiers in backticks (`` Migrate from `node:test` to `vitest` ``). Explain the why in the body when the subject cannot carry it.

Nothing in the body is ever wrapped by hand. A paragraph is a single line, as long as the paragraph itself, and a blank line is all that separates one paragraph from the next — exactly as in a Markdown file. No column limit applies, neither 72 nor 80 nor 100: where the text breaks is for the reader's window to decide, not for the author. Everything else follows the rules for Markdown files, including the rules from the “Prose typography” section above.

The message ends with its last paragraph. It carries no trailers whatsoever — no `Co-Authored-By`, no `Signed-off-by`, no note about the tool the commit was written with.
