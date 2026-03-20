# Display Config With Defaults (Resolve Pattern)

Date: 2026-03-20

## What

Use a small configuration object with optional fields, then resolve it into a complete “defaults applied” object before formatting.

In this repo:

- `DisplayPreferences` is the external (optional) config shape.
- A private resolved shape is built with defaults and basic validation before being used.

## When to use

- You want to make output formatting customizable without rewriting business logic.
- You want new options to be added later without changing every call site (extensibility).
- You want to keep stable defaults but allow overrides.

## Why it helps

- Call sites stay simple (`fn(..., {})` or omit the arg entirely).
- Default behavior remains stable for existing tests/users.
- Validation happens once at the boundary, not scattered across formatting code.

## Pitfalls

- Avoid “partial deep merge” bugs when you add nested config objects (resolve explicitly).
- Validate numbers that impact formatting (e.g. decimals must be an integer >= 0).
- Keep “logic” (budget math) separate from “presentation” (strings).

## Debugging clues

- If formatting differs from expected defaults, check which overrides were passed.
- If a thrown error references `DisplayPreferences`, inspect the bad value and its path (e.g. `currency.decimals`).
