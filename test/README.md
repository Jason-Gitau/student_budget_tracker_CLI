# Tests (learning-focused)

This project keeps tests in `test/` and runs them with the `npm test` script.

## How to run tests

- Run all tests: `npm test`
- Typecheck only (no running): `npm run typecheck`

## What “unit test” means here

A unit test should validate **one small unit** of behavior (a function/module) without depending on:

- user input (readline prompts)
- the network
- the filesystem (unless you’re specifically testing file I/O)
- real time

In this repo, most unit tests call pure functions from `src/lib.ts` directly.

## Do tests go to “prod”?

Usually:

- You *do* commit tests to your repository (so they run in CI and future you can trust refactors).
- You typically *don’t* ship tests as part of a production artifact (for example, you don’t bundle them into a deployed server build).

For a Node CLI:

- If you publish a package, you can exclude `test/` from the published tarball (commonly via `files` in `package.json` or `.npmignore`).
- Even if tests aren’t shipped, they’re still “production-grade” in the sense that they protect your production code from regressions.

## How to read tests written by AI (practical checklist)

When you see a test, look for these parts:

1. **Name**: does it clearly state behavior? (not implementation)
2. **Arrange**: set up inputs and any fakes/spies
3. **Act**: call the function (or run the unit under test)
4. **Assert**: verify outputs and side effects

Red flags to watch for:

- The test doesn’t fail when you break the behavior (weak assertions).
- The test asserts on implementation details (private variables, exact log formatting) instead of outcomes.
- The test has hidden dependencies (order-dependent, shared global state like `process.exitCode`).
- The test passes even if the code under test never ran.

## Patterns you’ll see in this repo

- `assert` from Node (`node:assert/strict`) for simple, dependency-free assertions.
- “Spy” by temporarily replacing a function (example: `console.error = (...) => { ... }`) and restoring it in `finally`.
- Guarding globals in tests:
  - if a unit touches `process.exitCode`, store/restore it so other tests don’t become flaky.

## Writing new tests (a production mindset)

Good tests:

- are deterministic (same result every run)
- fail for the right reason (clear assertion message)
- are focused (one behavior, minimal setup)
- are readable by someone who didn’t write the code (future you)

If you want more realism later:

- add a small “integration test” that spawns the CLI process and asserts on output/exit code
- keep unit tests fast; use integration tests sparingly

