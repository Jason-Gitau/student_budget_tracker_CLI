import assert from "node:assert/strict";
import { describe, it } from "vitest";

import { getIntroText, parseCliCommand } from "../src/cliCommands";

describe("cliCommands", () => {
  it("parseCliCommand defaults to start and accepts aliases", () => {
    assert.equal(parseCliCommand(""), "start");
    assert.equal(parseCliCommand("   "), "start");
    assert.equal(parseCliCommand("start"), "start");
    assert.equal(parseCliCommand("RUN"), "start");
    assert.equal(parseCliCommand("h"), "help");
    assert.equal(parseCliCommand("?"), "help");
    assert.equal(parseCliCommand("quit"), "exit");
    assert.equal(parseCliCommand("Q"), "exit");
  });

  it("parseCliCommand returns unknown for unrecognized input", () => {
    assert.equal(parseCliCommand("nope"), "unknown");
  });

  it("getIntroText points users to --help", () => {
    const intro: string = getIntroText();
    assert.equal(intro.includes("--help"), true);
  });
});
