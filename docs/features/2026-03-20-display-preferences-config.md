# Add Display Preferences Configuration Object

Date: 2026-03-20

## Why

- Make the CLI output formatting customizable (currency, decimals, newline, overspent text) without changing the budget math.
- Practice a common production pattern: “formatting/config as data”, separate from core logic.

## What changed

- Files touched:
  - `src/lib.ts`
  - `src/app.ts`
  - `test/**/*.test.ts`
- New/changed functions/types:
  - `DisplayPreferences` (new)
  - `formatStudentSummary(..., displayPreferences?)` (new optional param)
  - `formatBudgetReport(..., displayPreferences?)` (new optional param)
  - `buildStudentBudgetOutput(input, displayPreferences?)` (new optional param)

## TypeScript patterns practiced

- Configuration object type (`DisplayPreferences`) to make formatting extensible.
- Default parameters (`displayPreferences: DisplayPreferences = {}`) to keep call sites simple.
- “Resolve optional config” pattern to turn partial options into a validated, complete set of defaults.

## Runtime notes (Node / environment)

- No new Node APIs; this is a pure formatting change.

## Debugging checklist

- If output formatting looks wrong, inspect the `DisplayPreferences` passed at the call site.
- If you see a thrown error about `DisplayPreferences.*`, the config is invalid (e.g. negative decimals or empty newline).

## “What to ask AI next time”

- “Add a config object for formatting, but keep the budgeting logic unchanged.”
- “Use optional nested config with defaults, and validate the resolved config.”
- “Update unit tests to cover both defaults and custom formatting.”
