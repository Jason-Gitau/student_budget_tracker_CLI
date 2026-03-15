import assert from "node:assert/strict";

import { checkBudget, formatBudgetReport, formatStudentSummary } from "../src/lib";
import type { BudgetCheckResult } from "../src/lib";

type TestCase = {
  name: string;
  run: () => void;
};

const tests: TestCase[] = [
  {
    name: "formatStudentSummary includes exactly one $",
    run: (): void => {
      const output: string = formatStudentSummary("Alex", 300);
      assert.equal(output.includes("Student: Alex"), true);
      assert.equal(output.includes("Monthly allowance: $300.00"), true);
      assert.equal(output.includes("$$"), false);
    },
  },
  {
    name: "checkBudget computes remaining and overspent",
    run: (): void => {
      const ok: BudgetCheckResult = checkBudget(250, 300);
      assert.equal(ok.remainingBalance, 50);
      assert.equal(ok.isOverspent, false);

      const over: BudgetCheckResult = checkBudget(350, 300);
      assert.equal(over.remainingBalance, -50);
      assert.equal(over.isOverspent, true);
    },
  },
  {
    name: "formatBudgetReport includes exactly one $ per money field",
    run: (): void => {
      const result: BudgetCheckResult = checkBudget(250, 300);
      const report: string = formatBudgetReport(250, result);
      assert.equal(report.includes("Spent this month: $250.00"), true);
      assert.equal(report.includes("Remaining balance: $50.00"), true);
      assert.equal(report.includes("$$"), false);
    },
  },
];

let failures: number = 0;
for (const t of tests) {
  try {
    t.run();
    console.log("PASS:", t.name);
  } catch (err: unknown) {
    failures += 1;
    console.log("FAIL:", t.name);
    console.log(err);
  }
}

if (failures > 0) {
  process.exitCode = 1;
}

