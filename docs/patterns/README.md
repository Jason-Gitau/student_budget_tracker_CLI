# Pattern Notes

This directory is a running log of **TypeScript patterns** you practice in this repo.

These notes are written for two audiences:

- **Right now**: help you understand what the pattern is and how it shows up in real code.
- **Future you**: a quick refresher with "when to use it", pitfalls, and debugging clues.

## When to add a note

Add a new file here whenever you introduce or practice a pattern, for example:

- `unknown` + narrowing (`instanceof`, `typeof`, custom type guards)
- Discriminated unions and exhaustive checks
- Result/Option types (or similar error handling patterns)
- Boundaries (I/O edges, parsing, validation) and where types help

## Naming

Use: `YYYY-MM-DD-short-title.md`

Example: `2026-03-18-catch-unknown-and-narrow.md`

## Template

Start from `docs/patterns/_template.md`.

