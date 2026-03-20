# Feature Notes

This directory is a running log of **new features** added to the app.

Goal: learn how TypeScript is used in real codebases (types-as-design, error handling patterns, module boundaries, runtime vs type-time, Node APIs), so you can **read/debug AI-written code** and **guide AI** toward better implementations.

## When to add a note

Add a new file here whenever you:

- Add a new feature or CLI flow
- Touch architecture (modules, boundaries, error handling, I/O)

For **pattern-focused** notes (type guards, `unknown`, unions, narrowing, etc.), use `docs/patterns/`.

## Naming

Use: `YYYY-MM-DD-short-title.md`

Example: `2026-03-18-error-boundary.md`

## Template

Start from `docs/features/_template.md`.
