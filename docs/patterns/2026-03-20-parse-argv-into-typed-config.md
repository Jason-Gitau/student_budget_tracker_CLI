# Parse argv Into a Typed Config

Date: 2026-03-20

## What

Convert `process.argv` (strings) into a small typed object your app can use, e.g.:

- `showHelp: boolean`
- `errors: string[]`
- `displayPreferences: DisplayPreferences`

## Why it helps

- Keeps the entrypoint (`src/index.ts`) mostly about I/O and flow control.
- Makes parsing logic easy to unit test (no readline, no console).
- Lets you extend the CLI safely by adding one new flag at a time.

## Common pitfalls

- When running via npm scripts, args need `--` (example: `npm start -- --help`).
- Validate numeric flags early (e.g. decimals must be integer >= 0).
- Unknown flags should fail loudly (error + help).
