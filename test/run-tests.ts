import assert from "node:assert/strict";

import { checkBudget, formatBudgetReport, formatStudentSummary } from "../src/lib";
import type { BudgetCheckResult } from "../src/lib";
import { formatUnknownError, runWithErrorBoundary } from "../src/index";
import { buildStudentBudgetOutput } from "../src/app";

type TestCase = {
  name: string;
  run: () => void | Promise<void>;
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
  {
    name: "formatUnknownError handles Error and string",
    run: (): void => {
      const err: Error = new Error("Boom");
      const fromErr: string = formatUnknownError(err);
      assert.equal(fromErr.includes("Boom"), true);

      const fromString: string = formatUnknownError("plain error");
      assert.equal(fromString, "plain error");
    },
  },
  {
    name: "formatUnknownError handles circular values without throwing",
    run: (): void => {
      const circular: { self?: unknown } = {};
      circular.self = circular;

      const output: string = formatUnknownError(circular);
      assert.equal(typeof output, "string");
      assert.equal(output.length > 0, true);
    },
  },
  {
    name: "runWithErrorBoundary reports error and sets exitCode",
    run: async (): Promise<void> => {
      const previousExitCode: NodeJS.Process["exitCode"] = process.exitCode;
      process.exitCode = undefined;

      const errors: string[] = [];
      const originalConsoleError: (...args: unknown[]) => void = console.error;
      console.error = (...args: unknown[]): void => {
        errors.push(args.map((a: unknown) => String(a)).join(" "));
      };

      let exitCodeAfter: NodeJS.Process["exitCode"];
      try {
        await runWithErrorBoundary(
          async (): Promise<void> => {
            throw new Error("Test failure");
          },
          { installProcessHandlers: false, fatalContext: "Fatal error" }
        );
        exitCodeAfter = process.exitCode;
      } finally {
        console.error = originalConsoleError;
        process.exitCode = previousExitCode;
      }

      assert.equal(errors.some((line: string) => line.includes("Fatal error:")), true);
      assert.equal(errors.some((line: string) => line.includes("Test failure")), true);
      assert.equal(exitCodeAfter, 1);
    },
  },
  {
    name: "buildStudentBudgetOutput composes summary and report (pure)",
    run: (): void => {
      const out = buildStudentBudgetOutput({
        studentName: "Alex",
        monthlyAllowance: 300,
        amountSpent: 250,
      });

      assert.equal(out.summary.includes("Student: Alex"), true);
      assert.equal(out.report.includes("Spent this month: $250.00"), true);
      assert.equal(out.budgetResult.remainingBalance, 50);
      assert.equal(out.budgetResult.isOverspent, false);
    },
  },
  {
    name: "buildStudentBudgetOutput rejects invalid inputs",
    run: (): void => {
      assert.throws((): void => {
        buildStudentBudgetOutput({ studentName: "   ", monthlyAllowance: 10, amountSpent: 0 });
      });

      assert.throws((): void => {
        buildStudentBudgetOutput({ studentName: "Alex", monthlyAllowance: -1, amountSpent: 0 });
      });

      assert.throws((): void => {
        buildStudentBudgetOutput({ studentName: "Alex", monthlyAllowance: 10, amountSpent: -5 });
      });
    },
  },
];

let failures: number = 0;
(async (): Promise<void> => {
  for (const t of tests) {
    try {
      await t.run();
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
})();
