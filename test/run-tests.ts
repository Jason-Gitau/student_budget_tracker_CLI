import fs from "node:fs/promises";
import path from "node:path";

async function listTestFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath: string = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listTestFiles(fullPath)));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".test.js")) continue;
    if (entry.name === "run-tests.js") continue;
    files.push(fullPath);
  }

  return files;
}

(async (): Promise<void> => {
  const testDir: string = __dirname;
  const testFiles: string[] = await listTestFiles(testDir);

  if (testFiles.length === 0) {
    console.error(`No test files found under ${testDir}.`);
    process.exitCode = 1;
    return;
  }

  for (const file of testFiles.sort()) {
    require(file);
  }
})();

