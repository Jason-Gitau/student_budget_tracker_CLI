# Add CLI Flags + --help

Date: 2026-03-20

## Why

- Let users customize output formatting from the CLI (without code changes).
- Make the CLI self-documenting via `--help`.

## What changed

- Files touched:
  - `src/cliArgs.ts`
  - `src/index.ts`
  - `test/**/*.test.ts`
- New/changed functions/types:
  - `parseCliArgs(argv)` (new)
  - `getHelpText()` (new)

## TypeScript patterns practiced

- Parse `process.argv` into a typed result object (`CliParseResult`).
- Keep parsing pure/testable (no I/O inside the parser).
- Feed flags into a config object (`DisplayPreferences`) used by formatting functions.

## Runtime notes (Node / environment)

- `process.argv` contains the raw CLI args; when running via npm, pass args after `--`:
  - `npm start -- --help`

## Debugging checklist

- If flags seem ignored, confirm you used `npm start -- ...` (note the `--`).
- If you get errors, rerun with `--help` to see valid options.

## “What to ask AI next time”

- “Add a `--help` flag with usage + examples, and make invalid flags print help plus an error.”
- “Parse args into a typed result so it’s unit-testable.”
