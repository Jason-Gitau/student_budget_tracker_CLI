import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { getHelpText, parseCliArgs } from "../src/cliArgs";

describe("cliArgs", () => {
  it("parseCliArgs recognizes --help and -h", () => {
    assert.equal(parseCliArgs(["--help"]).showHelp, true);
    assert.equal(parseCliArgs(["-h"]).showHelp, true);
  });

  it("parseCliArgs builds DisplayPreferences from flags", () => {
    const parsed = parseCliArgs([
      "--currency-symbol",
      "â‚¬",
      "--currency-decimals",
      "0",
      "--newline",
      "\\n",
      "--overspent-style",
      "yesNo",
    ]);

    assert.equal(parsed.errors.length, 0);
    assert.equal(parsed.displayPreferences.currency?.symbol, "â‚¬");
    assert.equal(parsed.displayPreferences.currency?.decimals, 0);
    assert.equal(parsed.displayPreferences.newline, "\\n");
    assert.equal(parsed.displayPreferences.overspentStyle, "yesNo");
  });

  it("parseCliArgs rejects unknown args and missing values", () => {
    const unknown = parseCliArgs(["--nope"]);
    assert.equal(unknown.errors.length, 1);
    assert.equal(unknown.errors[0]?.includes("Unknown argument"), true);

    const missing = parseCliArgs(["--currency-symbol"]);
    assert.equal(missing.errors.length, 1);
    assert.equal(missing.errors[0]?.includes("requires a value"), true);
  });

  it("getHelpText includes usage and options", () => {
    const help: string = getHelpText();
    assert.equal(help.includes("Usage:"), true);
    assert.equal(help.includes("--currency-symbol"), true);
    assert.equal(help.includes("--help"), true);
  });
});
