import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { checkBudget, formatBudgetReport, formatStudentSummary } from "../src/lib";
import type { BudgetCheckResult, DisplayPreferences } from "../src/lib";

describe("lib", () => {
  it("formatStudentSummary includes exactly one $", () => {
    const output: string = formatStudentSummary("Alex", 300);
    assert.equal(output.includes("Student: Alex"), true);
    assert.equal(output.includes("Monthly allowance: $300.00"), true);
    assert.equal(output.includes("$$"), false);
  });

  it("checkBudget computes remaining and overspent", () => {
    const ok: BudgetCheckResult = checkBudget(250, 300);
    assert.equal(ok.remainingBalance, 50);
    assert.equal(ok.isOverspent, false);

    const over: BudgetCheckResult = checkBudget(350, 300);
    assert.equal(over.remainingBalance, -50);
    assert.equal(over.isOverspent, true);
  });

  it("formatBudgetReport includes exactly one $ per money field", () => {
    const result: BudgetCheckResult = checkBudget(250, 300);
    const report: string = formatBudgetReport(250, result);
    assert.equal(report.includes("Spent this month: $250.00"), true);
    assert.equal(report.includes("Remaining balance: $50.00"), true);
    assert.equal(report.includes("$$"), false);
  });

  it("DisplayPreferences can change currency symbol/decimals", () => {
    const prefs: DisplayPreferences = { currency: { symbol: "â‚¬", decimals: 0 } };
    const summary: string = formatStudentSummary("Alex", 300, prefs);
    assert.equal(summary.includes("Monthly allowance: â‚¬300"), true);
    assert.equal(summary.includes("$"), false);
  });

  it("DisplayPreferences can change overspent output style", () => {
    const result: BudgetCheckResult = checkBudget(250, 300);
    const report: string = formatBudgetReport(250, result, { overspentStyle: "yesNo" });
    assert.equal(report.includes("Overspent: NO"), true);
  });

  it("DisplayPreferences validates bad decimals and newline", () => {
    assert.throws((): void => {
      formatStudentSummary("Alex", 300, { currency: { decimals: -1 } });
    });

    assert.throws((): void => {
      formatBudgetReport(250, checkBudget(250, 300), { newline: "" });
    });
  });
});
