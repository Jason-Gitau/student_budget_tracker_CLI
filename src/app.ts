import { checkBudget, formatBudgetReport, formatStudentSummary } from "./lib";
import type { BudgetCheckResult } from "./lib";

export type StudentBudgetInput = {
  studentName: string;
  monthlyAllowance: number;
  amountSpent: number;
};

export type StudentBudgetOutput = {
  summary: string;
  report: string;
  budgetResult: BudgetCheckResult;
};

function assertNonEmptyText(label: string, value: string): void {
  const trimmed: string = value.trim();
  if (trimmed.length === 0) {
    throw new Error(label + " must be non-empty.");
  }
}

function assertFiniteNumber(label: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new Error(label + " must be a finite number.");
  }
}

function assertMin(label: string, value: number, min: number): void {
  if (value < min) {
    throw new Error(label + " must be >= " + String(min) + ".");
  }
}

export function buildStudentBudgetOutput(input: StudentBudgetInput): StudentBudgetOutput {
  assertNonEmptyText("Student name", input.studentName);

  assertFiniteNumber("Monthly allowance", input.monthlyAllowance);
  assertMin("Monthly allowance", input.monthlyAllowance, 0);

  assertFiniteNumber("Amount spent", input.amountSpent);
  assertMin("Amount spent", input.amountSpent, 0);

  const summary: string = formatStudentSummary(input.studentName, input.monthlyAllowance);
  const budgetResult: BudgetCheckResult = checkBudget(input.amountSpent, input.monthlyAllowance);
  const report: string = formatBudgetReport(input.amountSpent, budgetResult);

  return { summary: summary, report: report, budgetResult: budgetResult };
}

