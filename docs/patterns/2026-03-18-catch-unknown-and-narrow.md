# `catch (err: unknown)` + Narrowing with `instanceof Error`

Date: 2026-03-18

## What it is (right now)

- In TypeScript, a `catch` value should be treated as **unknown** until you narrow it.
- Narrowing means using checks like `err instanceof Error` (or `typeof err === "string"`) before accessing properties.
- This prevents you from accidentally assuming every thrown value is an `Error` (AI code often throws strings/objects).

## What it looks like in this repo

- Files:
  - `src/index.ts`
- Identifiers:
  - `formatUnknownError(err: unknown): string`
  - `runMainWithErrorBoundary(): Promise<void>`

## Why it helps (future you)

- Makes error handling honest: you only use `message`/`stack` when you truly have an `Error`.
- Avoids secondary crashes in error-reporting code (the worst time to crash again).
- Produces better diagnostics when something throws a non-`Error` value.

## Common pitfalls

- Writing `catch (err: any)` and then doing `err.message` blindly.
- Logging `JSON.stringify(err)` without guarding against circular structures (can throw).
- Swallowing errors without setting a non-zero exit code in CLIs.

## Debugging clues

- If logs show `[object Object]` or a JSON blob, something threw a non-`Error`.
- If there’s no stack trace, check whether the thrown value was a string/object.

## Quick refresher

- Treat caught values as `unknown`.
- Narrow with `instanceof Error` before using `.message`/`.stack`.
- Handle strings separately (`typeof err === "string"`).
- Be defensive when stringifying unknowns.

## “What to ask AI next time”

- “Use `catch (err: unknown)` and narrow with `instanceof Error`.”
- “Add a helper that formats unknown thrown values without throwing.”
- “For CLIs, set `process.exitCode = 1` when a fatal error happens.”

