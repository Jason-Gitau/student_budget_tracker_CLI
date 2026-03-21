# Tests

Tests live under `test/` and are run with Vitest.

## Commands

- Run all tests: `npm test`
- Typecheck (no running): `npm run typecheck`

## Conventions (standard practice)

- Add new test files as `test/**/*.test.ts`
- Keep each file focused on one module (example: `test/lib.test.ts`, `test/cliArgs.test.ts`)

## Notes

- Tests use Vitest for `describe`/`it` structure and `node:assert/strict` for assertions.
- A few tests temporarily override globals (like `console.error` or `process.exitCode`) and restore them in `finally` to avoid cross-test flakiness.
