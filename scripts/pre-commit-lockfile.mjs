import { execSync } from "node:child_process";

function stagedFiles() {
  const output = execSync("git diff --cached --name-only --diff-filter=ACMR", {
    encoding: "utf8",
  });
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

const staged = stagedFiles();
const packageJsonStaged = staged.includes("package.json");
const lockfileStaged = staged.includes("package-lock.json");

if (packageJsonStaged && !lockfileStaged) {
  console.error("");
  console.error("package.json is staged but package-lock.json is not.");
  console.error("Run: npm install");
  console.error("Then stage both files in the same commit.");
  process.exit(1);
}

if (lockfileStaged && !packageJsonStaged) {
  console.error("");
  console.error("package-lock.json is staged without package.json.");
  console.error("If you only changed app code, unstage the lockfile:");
  console.error("  git restore --staged package-lock.json");
  console.error("  git restore package-lock.json");
  process.exit(1);
}

execSync("node scripts/check-lockfile.mjs --fast", { stdio: "inherit" });
