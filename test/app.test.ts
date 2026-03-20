import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildStudentBudgetOutput } from "../src/app";

describe("app", () => {
  it("buildStudentBudgetOutput composes summary and report (pure)", () => {
    const out = buildStudentBudgetOutput({
      studentName: "Alex",
      monthlyAllowance: 300,
      amountSpent: 250,
    });

    assert.equal(out.summary.includes("Student: Alex"), true);
    assert.equal(out.report.includes("Spent this month: $250.00"), true);
    assert.equal(out.budgetResult.remainingBalance, 50);
    assert.equal(out.budgetResult.isOverspent, false);
  });

  it("buildStudentBudgetOutput rejects invalid inputs", () => {
    assert.throws((): void => {
      buildStudentBudgetOutput({ studentName: "   ", monthlyAllowance: 10, amountSpent: 0 });
    });

    assert.throws((): void => {
      buildStudentBudgetOutput({ studentName: "Alex", monthlyAllowance: -1, amountSpent: 0 });
    });

    assert.throws((): void => {
      buildStudentBudgetOutput({ studentName: "Alex", monthlyAllowance: 10, amountSpent: -5 });
    });
  });

  it("buildStudentBudgetOutput applies display preferences", () => {
    const out = buildStudentBudgetOutput(
      { studentName: "Alex", monthlyAllowance: 300, amountSpent: 250 },
      { currency: { symbol: "Â£", decimals: 1 } }
    );
    assert.equal(out.summary.includes("Monthly allowance: Â£300.0"), true);
    assert.equal(out.report.includes("Spent this month: Â£250.0"), true);
  });
});

