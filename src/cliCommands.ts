export type CliCommand = "start" | "help" | "exit";

export function parseCliCommand(input: string): CliCommand | "unknown" {
  const normalized: string = input.trim().toLowerCase();

  if (normalized.length === 0) {
    return "start";
  }

  if (normalized === "start" || normalized === "s" || normalized === "run") {
    return "start";
  }

  if (normalized === "help" || normalized === "h" || normalized === "?") {
    return "help";
  }

  if (normalized === "exit" || normalized === "quit" || normalized === "q") {
    return "exit";
  }

  return "unknown";
}

export function getIntroText(): string {
  return [
    "Student Budget Tracker",
    "",
    "Type a command to begin, or run this program with --help to see all CLI flags.",
  ].join("\n");
}

