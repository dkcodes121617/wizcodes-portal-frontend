import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const fast = process.argv.includes("--fast");
const lockfilePath = "package-lock.json";
const before = readFileSync(lockfilePath, "utf8");

try {
  execSync("npm install --package-lock-only --ignore-scripts", {
    stdio: "pipe",
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
  });
} catch (error) {
  console.error("check-lockfile: failed to validate package-lock.json with npm.");
  if (error.stderr) {
    process.stderr.write(error.stderr);
  }
  process.exit(1);
}

const after = readFileSync(lockfilePath, "utf8");

if (before !== after) {
  writeFileSync(lockfilePath, before);
  console.error("");
  console.error("package-lock.json is out of sync with package.json.");
  console.error("Run: npm install");
  console.error("Then stage package-lock.json together with package.json.");
  process.exit(1);
}

if (fast) {
  console.log("package-lock.json is in sync.");
  process.exit(0);
}

try {
  execSync("npm ci --ignore-scripts", {
    stdio: "pipe",
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
  });
} catch (error) {
  console.error("");
  console.error("npm ci failed. package-lock.json cannot be installed cleanly.");
  if (error.stderr) {
    process.stderr.write(error.stderr);
  }
  process.exit(1);
}

console.log("package-lock.json is in sync.");
