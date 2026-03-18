# Add a Simple Error Boundary Around `main()`

Date: 2026-03-18

## Why

- Previously, some unhandled failures could look like a “silent crash” (especially unhandled promise rejections).
- For a learning CLI, it’s better to fail loudly with a clear message and a non-zero exit code.

## What changed

- Files touched:
  - `src/index.ts`
- New helpers:
  - `formatUnknownError(err: unknown): string`
  - `reportFatalError(context: string, err: unknown): void`
  - `installProcessErrorHandlers(): void`
  - `runMainWithErrorBoundary(): Promise<void>`

## TypeScript patterns practiced

- `unknown` in `catch` + narrowing with a type guard:
  - `catch (err: unknown)` forces you to *prove* what you have before using it.
  - `err instanceof Error` safely unlocks `err.message` / `err.stack`.
- Defensive stringification of unknown values:
  - Handle `Error`, `string`, and “anything else” without crashing the logger itself.

Related pattern note:

- `docs/patterns/2026-03-18-catch-unknown-and-narrow.md`

## Runtime notes (Node / environment)

- `process.on("unhandledRejection", ...)`:
  - Captures promise rejections that weren’t awaited/handled.
  - Sets `process.exitCode` instead of calling `process.exit(...)` so pending I/O can still flush.
- `process.on("uncaughtException", ...)`:
  - Captures exceptions that escape the call stack.
  - Still marks the run as failed via `process.exitCode = 1`.

## Debugging checklist

- If the CLI exits unexpectedly:
  - Look for “Fatal error”, “Unhandled promise rejection”, or “Uncaught exception” output.
  - If it’s an `Error`, start with the topmost stack frame in `src/` to find the first app-owned callsite.
- If logs look weird:
  - Confirm what was thrown (an `Error` vs a string vs an object). AI code sometimes throws non-`Error` values.

## “What to ask AI next time”

- “Use `catch (err: unknown)` and narrow with `instanceof Error`.”
- “Prefer `process.exitCode` over `process.exit()` unless you have a specific reason.”
- “Include a small helper to format unknown thrown values without throwing again.”
