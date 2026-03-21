# student-budget-tracker

Simple TypeScript CLI app for tracking a student's monthly budget.

## Requirements

- Node.js 22+
- npm

## Quickstart

- Install: `npm ci`
- Run (interactive): `npm start`
- Typecheck: `npm run typecheck`
- Build JS to `dist/`: `npm run build`
- Run tests: `npm test`

## Tests

- Tests live in `test/**/*.test.ts`.
- Tests run with Vitest via `npm test`.

## CI

GitHub Actions runs `npm ci`, `npm run typecheck`, `npm run build`, and `npm test` on pushes and pull requests to `main`.
