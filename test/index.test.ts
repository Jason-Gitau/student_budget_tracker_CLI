import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { formatUnknownError, runWithErrorBoundary } from "../src/index";

describe("index utilities", () => {
  it("formatUnknownError handles Error and string", () => {
    const err: Error = new Error("Boom");
    const fromErr: string = formatUnknownError(err);
    assert.equal(fromErr.includes("Boom"), true);

    const fromString: string = formatUnknownError("plain error");
    assert.equal(fromString, "plain error");
  });

  it("formatUnknownError handles circular values without throwing", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    const output: string = formatUnknownError(circular);
    assert.equal(typeof output, "string");
    assert.equal(output.length > 0, true);
  });

  it("runWithErrorBoundary reports error and sets exitCode", async () => {
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
  });
});
