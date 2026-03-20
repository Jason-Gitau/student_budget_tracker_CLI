export type DisplayPreferences = {
  currency?: {
    symbol?: string;
    decimals?: number;
  };
  newline?: string;
  overspentStyle?: "boolean" | "yesNo";
};

type ResolvedDisplayPreferences = {
  currency: {
    symbol: string;
    decimals: number;
  };
  newline: string;
  overspentStyle: "boolean" | "yesNo";
};

const DEFAULT_DISPLAY_PREFERENCES: ResolvedDisplayPreferences = {
  currency: { symbol: "$", decimals: 2 },
  newline: "\n",
  overspentStyle: "boolean",
};

function resolveDisplayPreferences(preferences: DisplayPreferences = {}): ResolvedDisplayPreferences {
  const resolved: ResolvedDisplayPreferences = {
    currency: {
      symbol: preferences.currency?.symbol ?? DEFAULT_DISPLAY_PREFERENCES.currency.symbol,
      decimals: preferences.currency?.decimals ?? DEFAULT_DISPLAY_PREFERENCES.currency.decimals,
    },
    newline: preferences.newline ?? DEFAULT_DISPLAY_PREFERENCES.newline,
    overspentStyle: preferences.overspentStyle ?? DEFAULT_DISPLAY_PREFERENCES.overspentStyle,
  };

  const decimals: number = resolved.currency.decimals;
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error("DisplayPreferences.currency.decimals must be an integer >= 0.");
  }

  if (resolved.newline.length === 0) {
    throw new Error("DisplayPreferences.newline must be non-empty.");
  }

  return resolved;
}

function formatMoney(value: number, preferences: ResolvedDisplayPreferences): string {
  return preferences.currency.symbol + value.toFixed(preferences.currency.decimals);
}

function formatOverspentValue(isOverspent: boolean, preferences: ResolvedDisplayPreferences): string {
  if (preferences.overspentStyle === "yesNo") {
    return isOverspent ? "YES" : "NO";
  }

  return String(isOverspent);
}

type BudgetCheckResult = { // Explicit: named object type keeps the return type readable and consistent.
  remainingBalance: number; // Explicit: enforces the balance stays numeric for formatting and comparisons.
  isOverspent: boolean; // Explicit: enforces a true boolean flag for overspending state.
};

export function formatStudentSummary(
  studentName: string, // Explicit: function contract requires a student name as text.
  monthlyAllowance: number, // Explicit: function contract requires allowance as a number for formatting and math.
  displayPreferences: DisplayPreferences = {} // Explicit: formatting customization should not change logic.
): string /* Explicit: callers (CLI/tests) need a guaranteed string to print/assert on. */ {
  const preferences: ResolvedDisplayPreferences = resolveDisplayPreferences(displayPreferences);
  const nl: string = preferences.newline;

  const summary: string =
    "Student: " + studentName + nl + "Monthly allowance: " + formatMoney(monthlyAllowance, preferences); // Explicit: keeps output as a single string.
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
  budgetResult: BudgetCheckResult, // Explicit: requires the full budget result shape to avoid parallel params and keep types consistent.
  displayPreferences: DisplayPreferences = {} // Explicit: formatting customization should not change logic.
): string /* Explicit: returns one string blob for CLI printing and for test assertions. */ {
  const preferences: ResolvedDisplayPreferences = resolveDisplayPreferences(displayPreferences);
  const nl: string = preferences.newline;

  const report: string =
    nl +
    "Spent this month: " +
    formatMoney(amountSpent, preferences) +
    nl +
    "Remaining balance: " +
    formatMoney(budgetResult.remainingBalance, preferences) +
    nl +
    "Overspent: " +
    formatOverspentValue(budgetResult.isOverspent, preferences); // Explicit: ensure the final report is a single string value.
  return report;
}

export type { BudgetCheckResult }; // Explicit: re-export the type so tests/CLI can share the same shape.
