# Command Loop Before Prompts

Date: 2026-03-20

## What

Before starting an interactive “wizard”, ask the user what they want to do:

- start the normal flow
- show help
- exit

In this repo, the loop lives in `src/index.ts` and delegates string parsing to a pure function.

## Why it helps

- Users aren’t forced into a flow they didn’t choose.
- `help` is discoverable without restarting the app.
- The entrypoint stays readable by separating parsing (pure) and I/O (readline).

## Tips

- Make “default” behavior easy (press Enter to start).
- Treat unknown commands as recoverable (print a hint and re-prompt).
