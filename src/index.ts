import { createInterface } from "node:readline/promises";
import type { Interface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { buildStudentBudgetOutput } from "./app";
import type { StudentBudgetOutput } from "./app";
import { getHelpText, parseCliArgs } from "./cliArgs";
import { getIntroText, parseCliCommand } from "./cliCommands";
import { promptNonEmptyText, promptNumber } from "./io/readlinePrompts";

export function formatUnknownError(err: unknown): string {
  if (err instanceof Error) {
    return err.stack ?? err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function reportFatalError(context: string, err: unknown): void {
  console.error(context + ": " + formatUnknownError(err));
}

export function installProcessErrorHandlers(): void {
  process.on("unhandledRejection", (reason: unknown): void => {
    reportFatalError("Unhandled promise rejection", reason);
    process.exitCode = process.exitCode ?? 1;
  });

  process.on("uncaughtException", (err: unknown): void => {
    reportFatalError("Uncaught exception", err);
    process.exitCode = 1;
  });
}

async function main(): Promise<void> /* Explicit: async CLI entrypoint resolves with no value. */ {
  const parsed = parseCliArgs(process.argv.slice(2));
  if (parsed.showHelp) {
    console.log(getHelpText());
    return;
  }

  if (parsed.errors.length > 0) {
    for (const msg of parsed.errors) {
      console.error("Error:", msg);
    }
    console.error("");
    console.error(getHelpText());
    process.exitCode = 1;
    return;
  }

  const rl: Interface = createInterface({ input: input, output: output }); // Explicit: pins the readline interface type for our helpers.

  try {
    console.log(getIntroText());

    while (true) {
      const rawCommand: string = await rl.question("Command (Enter=start, help, exit): ");
      const command = parseCliCommand(rawCommand);

      if (command === "help") {
        console.log("");
        console.log(getHelpText());
        console.log("");
        continue;
      }

      if (command === "exit") {
        console.log("Goodbye.");
        return;
      }

      if (command === "start") {
        break;
      }

      console.log("Unknown command. Type 'help' or press Enter to start.");
    }

    const studentName: string = await promptNonEmptyText(rl, "Student name"); // Explicit: ensures name is a string for the summary function.
    const monthlyAllowance: number = await promptNumber(rl, "Monthly allowance", { min: 0 }); // Explicit: ensures allowance is numeric and non-negative.
    const amountSpent: number = await promptNumber(rl, "Amount spent this month", { min: 0 }); // Explicit: ensures spending is numeric and non-negative.

    const out: StudentBudgetOutput = buildStudentBudgetOutput(
      {
        studentName: studentName,
        monthlyAllowance: monthlyAllowance,
        amountSpent: amountSpent,
      },
      parsed.displayPreferences
    );

    console.log(out.summary);
    console.log(out.report);
  } finally {
    rl.close();
  }
}

export async function runWithErrorBoundary(
  fn: () => Promise<void>,
  options?: { installProcessHandlers?: boolean; fatalContext?: string }
): Promise<void> {
  if (options?.installProcessHandlers === true) {
    installProcessErrorHandlers();
  }

  try {
    await fn();
  } catch (err: unknown) {
    reportFatalError(options?.fatalContext ?? "Fatal error", err);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  void runWithErrorBoundary(main, { installProcessHandlers: true }); // Intentional: run the async entrypoint without top-level await.
}
