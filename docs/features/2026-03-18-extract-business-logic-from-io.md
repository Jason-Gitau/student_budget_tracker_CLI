# Extract Business Logic from I/O (Testability)

Date: 2026-03-18

## Why

- CLI code mixes I/O (readline + console) with decision-making easily.
- Separating “pure logic” from side effects makes code easier to test, reuse, and debug.

## What changed

- New pure orchestration module:
  - `src/app.ts` exports `buildStudentBudgetOutput(...)`
- New I/O-only module:
  - `src/io/readlinePrompts.ts` exports `promptNonEmptyText(...)` and `promptNumber(...)`
- CLI entrypoint now composes these:
  - `src/index.ts` reads inputs → calls pure function → prints outputs

## What became testable

- `buildStudentBudgetOutput(...)` can be unit-tested without:
  - creating a readline interface
  - mocking stdin/stdout
  - parsing console output

Related pattern note:

- `docs/patterns/2026-03-18-separate-pure-from-io.md`

