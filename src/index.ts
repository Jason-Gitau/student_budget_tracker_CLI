import { createInterface } from "node:readline/promises";
import type { Interface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { checkBudget, formatBudgetReport, formatStudentSummary } from "./lib";
import type { BudgetCheckResult } from "./lib";

async function promptNonEmptyText(
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

async function promptNumber(
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

async function main(): Promise<void> /* Explicit: async CLI entrypoint resolves with no value. */ {
    const rl: Interface = createInterface({ input: input, output: output }); // Explicit: pins the readline interface type for our helpers.

  try {
    const studentName: string = await promptNonEmptyText(rl, "Student name"); // Explicit: ensures name is a string for the summary function.
    const monthlyAllowance: number = await promptNumber(rl, "Monthly allowance", { min: 0 }); // Explicit: ensures allowance is numeric and non-negative.
    const amountSpent: number = await promptNumber(rl, "Amount spent this month", { min: 0 }); // Explicit: ensures spending is numeric and non-negative.

    const summaryOutput: string = formatStudentSummary(studentName, monthlyAllowance); // Explicit: ensures we print a string summary.
    console.log(summaryOutput);

    const budgetResult: BudgetCheckResult = checkBudget(amountSpent, monthlyAllowance); // Explicit: pins the result shape for output formatting.

    const budgetOutput: string = formatBudgetReport(amountSpent, budgetResult); // Explicit: ensures the report is a string produced by a testable formatter.
    console.log(budgetOutput);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  void main(); // Intentional: run the async entrypoint without top-level await.
}
