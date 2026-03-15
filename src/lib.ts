type BudgetCheckResult = { // Explicit: named object type keeps the return type readable and consistent.
  remainingBalance: number; // Explicit: enforces the balance stays numeric for formatting and comparisons.
  isOverspent: boolean; // Explicit: enforces a true boolean flag for overspending state.
};

export function formatStudentSummary(
  studentName: string, // Explicit: function contract requires a student name as text.
  monthlyAllowance: number // Explicit: function contract requires allowance as a number for formatting and math.
): string /* Explicit: callers (CLI/tests) need a guaranteed string to print/assert on. */ {
  const formattedAllowance: string = monthlyAllowance.toFixed(2); // Explicit: toFixed returns string; we pin it per requirement.
  const summary: string = "Student: " + studentName + "\nMonthly allowance: $" + formattedAllowance; // Explicit: keeps output as a single string.
  return summary;
}

export function checkBudget(
  amountSpent: number, // Explicit: spending must be numeric to compute remaining budget.
  allowance: number // Explicit: allowance must be numeric to compute remaining budget.
): BudgetCheckResult /* Explicit: returns a fixed-shape object used by the CLI/tests. */ {
  const remainingBalance: number = allowance - amountSpent; // Explicit: enforces numeric arithmetic result for downstream formatting.
  const isOverspent: boolean = remainingBalance < 0; // Explicit: ensures a boolean result instead of relying on truthy/falsy.

  const result: BudgetCheckResult = { remainingBalance: remainingBalance, isOverspent: isOverspent }; // Explicit: locks return value to the declared shape.
  return result;
}

export function formatBudgetReport(
  amountSpent: number, // Explicit: amount spent is required as a number for consistent currency formatting.
  budgetResult: BudgetCheckResult // Explicit: requires the full budget result shape to avoid parallel params and keep types consistent.
): string /* Explicit: returns one string blob for CLI printing and for test assertions. */ {
  const spentFormatted: string = amountSpent.toFixed(2); // Explicit: toFixed returns string; keep report formatting stable.
  const remainingFormatted: string = budgetResult.remainingBalance.toFixed(2); // Explicit: toFixed returns string; keep report formatting stable.
  const overspentText: string = String(budgetResult.isOverspent); // Explicit: normalize boolean to a string for concatenation.

  const report: string =
    "\nSpent this month: $" +
    spentFormatted +
    "\nRemaining balance: $" +
    remainingFormatted +
    "\nOverspent: " +
    overspentText; // Explicit: ensure the final report is a single string value.
  return report;
}

export type { BudgetCheckResult }; // Explicit: re-export the type so tests/CLI can share the same shape.
