import { execSync } from "node:child_process";

const fast = process.argv.includes("--fast");

if (fast) {
  console.log("lockfile:check --fast skips npm ci (see pre-commit staging rules).");
  process.exit(0);
}

try {
  execSync("npm ci --ignore-scripts", {
    stdio: "inherit",
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
  });
} catch {
  console.error("");
  console.error("npm ci failed. package-lock.json is out of sync with package.json.");
  console.error("Run: npm install");
  console.error("Then stage package-lock.json together with package.json.");
  process.exit(1);
}

console.log("package-lock.json is in sync.");
