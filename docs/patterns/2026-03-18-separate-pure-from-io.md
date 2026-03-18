# Separate Pure Functions from I/O (Separation of Concerns)

Date: 2026-03-18

## What it is (right now)

- Put “work” (calculations, decisions, formatting) into **pure functions**:
  - same input → same output
  - no reading input, no printing, no process/global mutations
- Put side effects (readline, printing, process handlers) into a thin **I/O layer**.

## What it looks like in this repo

- Pure orchestration:
  - `src/app.ts` (`buildStudentBudgetOutput`)
- I/O prompts:
  - `src/io/readlinePrompts.ts`
- Composition point:
  - `src/index.ts` (connects readline → pure logic → console)

## Why it helps (future you)

- Unit tests become simple: call a function and assert on return values.
- Debugging becomes local: pure logic can be stepped through without worrying about environment/state.
- AI-generated code improves when you can say: “keep I/O at the edges”.

## Common pitfalls

- “Helper” functions that still log to console or touch globals (not actually pure).
- Functions that both validate *and* prompt the user (mixing responsibilities).
- Tests that have to stub half of Node just to exercise one rule.

## Debugging clues

- If a unit test is hard to write, the code under test is probably mixing I/O and logic.
- If a bug only reproduces when running the CLI, add a pure function that takes inputs and returns outputs, then test it directly.

## Quick refresher

- Pure: takes data, returns data.
- I/O: reads/writes outside world.
- Compose at the boundary (usually `index.ts` / `main()`).

## “What to ask AI next time”

- “Move readline/console/process usage to a thin `io/` layer.”
- “Create a pure function that takes inputs and returns outputs; write tests for it.”
- “Avoid logging inside business logic; return values instead.”

