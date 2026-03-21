# Add Interactive Command Intro (start/help/exit)

Date: 2026-03-20

## Why

- Give users a chance to choose what to do *before* the app starts asking for inputs.
- Make the CLI discoverable: users can type `help` interactively or run with `--help`.

## What changed

- Files touched:
  - `src/cliCommands.ts`
  - `src/index.ts`
  - `test/**/*.test.ts`
- New/changed functions/types:
  - `parseCliCommand(input)` (new)
  - `getIntroText()` (new)

## TypeScript patterns practiced

- Parse free-form text into a small union (`"start" | "help" | "exit"`) plus an `"unknown"` outcome.
- Keep parsing pure and testable; keep readline I/O in the entrypoint.

## Runtime notes (Node / environment)

- This is an interactive loop before the usual prompts; it uses `readline` like the rest of the CLI.

## Debugging checklist

- If the app seems “stuck”, it’s waiting for a command (`Enter`, `help`, or `exit`).
- If `--help` is passed in argv, the program prints help and exits before entering interactive mode.
