import { createInterface } from "node:readline/promises";
import type { Interface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

type BudgetCheckResult = { // Explicit: named object type so function return annotation stays readable and consistent.
  remainingBalance: number; // Explicit: documents the numeric output and enforces it stays a number.
  isOverspent: boolean; // Explicit: ensures overspent is always a boolean flag, not truthy/falsy.
};

export function formatStudentSummary(
  studentName: string, // Explicit: function contract requires a name as text.
  monthlyAllowance: number // Explicit: function contract requires allowance as a number for formatting and math.
): string /* Explicit: guarantees callers get a string summary (CLI printing relies on this). */ {
  const formattedAllowance: string = monthlyAllowance.toFixed(2); // Explicit: toFixed returns string; annotated for clarity per requirement.
  const summary: string = `Student: ${studentName}\nMonthly allowance: $${formattedAllowance}`; // Explicit: ensures this value remains a string template result.
  return summary;
}

export function checkBudget(
  amountSpent: number, // Explicit: spending must be numeric to compute remaining budget.
  allowance: number // Explicit: allowance must be numeric to compute remaining budget.
): BudgetCheckResult /* Explicit: returns a fixed-shape object used by the CLI output. */ {
  const remainingBalance: number = allowance - amountSpent; // Explicit: enforces numeric arithmetic result for downstream formatting.
  const isOverspent: boolean = remainingBalance < 0; // Explicit: ensures a real boolean rather than relying on implicit coercion.

  const result: BudgetCheckResult = { remainingBalance: remainingBalance, isOverspent: isOverspent }; // Explicit: locks result to BudgetCheckResult shape.
  return result;
}

async function promptNonEmptyText(
  rl: Interface, // Explicit: enforces we receive a readline interface to ask questions.
  label: string // Explicit: ensures prompt label is always text for composing a question.
): Promise<string> /* Explicit: this prompt resolves to a string value from user input. */ {
  while (true) {
    const raw: string = await rl.question(`${label}: `); // Explicit: raw user input is a string from readline.
    const value: string = raw.trim(); // Explicit: we normalize to a string to validate emptiness consistently.

    if (value.length > 0) {
      return value;
    }

    console.log("Please enter a non-empty value."); // No type annotation: string literal is already a string, but requirement is about explicit annotations we control.
  }
}

async function promptNumber(
  rl: Interface, // Explicit: enforces we receive a readline interface to ask questions.
  label: string, // Explicit: ensures prompt label is always text for composing a question.
  options?: { min?: number; max?: number }
): Promise<number> /* Explicit: this prompt resolves to a number used in calculations. */ {
  while (true) {
    const raw: string = await rl.question(`${label}: `); // Explicit: raw user input is a string from readline.
    const trimmed: string = raw.trim(); // Explicit: normalizes input to a string for predictable parsing.
    const value: number = Number(trimmed); // Explicit: numeric parsing result must be a number for math ops later.

    if (!Number.isFinite(value)) {
      console.log("❌ Please enter a valid number.");
      continue;
    }
     if (options?.min !== undefined && value < options.min) {
      console.log(`❌ Value must be at least ${options.min}`);
      continue;
    }
    if (options?.max !== undefined && value > options.max) {
      console.log(`❌ Value must be at most ${options.max}`);
      continue;
    }
    return value;


    console.log("Please enter a valid number (e.g., 250 or 275.50).");
  }
}

async function main(): Promise<void> /* Explicit: async entrypoint returns a promise that resolves with no value. */ {
  const rl: Interface = createInterface({ input: input, output: output }); // Explicit: typing ensures we have the correct readline interface.

  try {
    const studentName: string = await promptNonEmptyText(rl, "Student name"); // Explicit: ensures we pass a string name into the summary function.
    const monthlyAllowance: number = await promptNumber(rl, "Monthly allowance", { min: 0 }); // Explicit: ensures allowance is numeric for formatting and math.
    const amountSpent: number = await promptNumber(rl, "Amount spent this month", { min: 0 }); // Explicit: ensures spent is numeric for math.

    const summaryOutput: string = formatStudentSummary(studentName, monthlyAllowance); // Explicit: ensures the summary is a string for console output.
    console.log(summaryOutput);

    const budgetResult: BudgetCheckResult = checkBudget(amountSpent, monthlyAllowance); // Explicit: ensures we handle both remaining + overspent.

    const remainingFormatted: string = budgetResult.remainingBalance.toFixed(2); // Explicit: toFixed returns string; keep formatting stable for CLI output.
    const spentFormatted: string = amountSpent.toFixed(2); // Explicit: toFixed returns string; keep formatting stable for CLI output.
    const budgetOutput: string =
      `\nSpent this month: $${spentFormatted}\nRemaining balance: $${remainingFormatted}\nOverspent: ${budgetResult.isOverspent}`; // Explicit: ensures final output remains a single string.
    console.log(budgetOutput);
  } finally {
    rl.close();
  }
}

void main(); // Explicit: discards the Promise so top-level doesn't need await while still running the async entrypoint.
