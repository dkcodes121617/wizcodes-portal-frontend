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
  console.log("");
  console.log("package.json changed — syncing package-lock.json with npm 10.9.2…");
  execSync("npm run lockfile:sync", { stdio: "inherit" });
  execSync("git add package-lock.json", { stdio: "inherit" });
  console.log("Staged package-lock.json.");
}

if (lockfileStaged && !packageJsonStaged) {
  console.log("Validating package-lock.json with npm 10.9.2…");
  execSync("node scripts/check-lockfile.mjs", { stdio: "inherit" });
  process.exit(0);
}

if (packageJsonStaged || lockfileStaged) {
  execSync("node scripts/check-lockfile.mjs", { stdio: "inherit" });
  process.exit(0);
}

console.log("lockfile:check skipped (package files not staged).");
