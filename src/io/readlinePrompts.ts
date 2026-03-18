import type { Interface } from "node:readline/promises";

export async function promptNonEmptyText(
  rl: Interface, // Explicit: ensures we can call rl.question(...) with correct typing.
  label: string // Explicit: ensures prompt label is always a string for composing the question.
): Promise<string> /* Explicit: this prompt resolves to a string value from user input. */ {
  while (true) {
    const raw: string = await rl.question(label + ": "); // Explicit: readline returns a string line.
    const value: string = raw.trim(); // Explicit: normalized input is still a string; annotated per requirement.

    if (value.length > 0) {
      return value;
    }

    console.log("Please enter a non-empty value.");
  }
}

export async function promptNumber(
  rl: Interface, // Explicit: ensures we can call rl.question(...) with correct typing.
  label: string, // Explicit: ensures prompt label is always a string for composing the question.
  options?: { min?: number; max?: number } // Explicit: typed options make validation rules explicit and type-safe.
): Promise<number> /* Explicit: this prompt resolves to a number used in calculations. */ {
  while (true) {
    const raw: string = await rl.question(label + ": "); // Explicit: readline returns a string line.
    const trimmed: string = raw.trim(); // Explicit: normalized input is a string; annotated per requirement.
    const value: number = Number(trimmed); // Explicit: parsing result must be a number for arithmetic.

    if (!Number.isFinite(value)) {
      console.log("Please enter a valid number (e.g., 300 or 250.50).");
      continue;
    }

    if (options?.min !== undefined && value < options.min) {
      console.log("Please enter a number >= " + String(options.min) + ".");
      continue;
    }

    if (options?.max !== undefined && value > options.max) {
      console.log("Please enter a number <= " + String(options.max) + ".");
      continue;
    }

    return value;
  }
}

