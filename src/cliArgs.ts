import type { DisplayPreferences } from "./lib";

export type CliParseResult = {
  showHelp: boolean;
  displayPreferences: DisplayPreferences;
  errors: string[];
};

function parseNonNegativeInteger(value: string): number | undefined {
  if (!/^\d+$/.test(value)) {
    return undefined;
  }
  const n: number = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    return undefined;
  }
  return n;
}

export function parseCliArgs(argv: string[]): CliParseResult {
  const errors: string[] = [];
  const displayPreferences: DisplayPreferences = {};
  let showHelp: boolean = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg: string = argv[i] ?? "";

    if (arg === "--help" || arg === "-h") {
      showHelp = true;
      continue;
    }

    if (arg === "--currency-symbol") {
      const value: string | undefined = argv[i + 1];
      if (value === undefined) {
        errors.push("--currency-symbol requires a value.");
        continue;
      }
      i += 1;
      displayPreferences.currency = { ...(displayPreferences.currency ?? {}), symbol: value };
      continue;
    }

    if (arg === "--currency-decimals") {
      const value: string | undefined = argv[i + 1];
      if (value === undefined) {
        errors.push("--currency-decimals requires a value.");
        continue;
      }
      i += 1;

      const parsed: number | undefined = parseNonNegativeInteger(value);
      if (parsed === undefined) {
        errors.push("--currency-decimals must be an integer >= 0.");
        continue;
      }

      displayPreferences.currency = { ...(displayPreferences.currency ?? {}), decimals: parsed };
      continue;
    }

    if (arg === "--newline") {
      const value: string | undefined = argv[i + 1];
      if (value === undefined) {
        errors.push("--newline requires a value.");
        continue;
      }
      i += 1;
      displayPreferences.newline = value;
      continue;
    }

    if (arg === "--overspent-style") {
      const value: string | undefined = argv[i + 1];
      if (value === undefined) {
        errors.push("--overspent-style requires a value (boolean|yesNo).");
        continue;
      }
      i += 1;

      if (value !== "boolean" && value !== "yesNo") {
        errors.push("--overspent-style must be one of: boolean, yesNo.");
        continue;
      }

      displayPreferences.overspentStyle = value;
      continue;
    }

    errors.push("Unknown argument: " + arg);
  }

  return { showHelp: showHelp, displayPreferences: displayPreferences, errors: errors };
}

export function getHelpText(): string {
  return [
    "Student Budget Tracker (interactive CLI)",
    "",
    "Usage:",
    "  npm start -- [options]",
    "",
    "Options:",
    "  -h, --help                 Show this help and exit",
    "  --currency-symbol <text>   Currency symbol (default: $)",
    "  --currency-decimals <n>    Currency decimals, integer >= 0 (default: 2)",
    "  --newline <text>           Line separator used in output (default: \\n)",
    "  --overspent-style <mode>   Overspent output: boolean|yesNo (default: boolean)",
    "",
    "Examples:",
    "  npm start -- --help",
    "  npm start -- --currency-symbol € --currency-decimals 0",
    "  npm start -- --overspent-style yesNo",
  ].join("\n");
}

