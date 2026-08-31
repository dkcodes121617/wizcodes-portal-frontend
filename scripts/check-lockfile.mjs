import { execSync } from "node:child_process";

const fast = process.argv.includes("--fast");

if (fast) {
  console.log("lockfile:check --fast skips npm ci (see pre-commit staging rules).");
  process.exit(0);
}

// Vercel's default Node image still resolves npm 10 unless corepack is enabled.
// Validate with npm 10 so override entries cannot disappear from package-lock.json.
try {
  execSync("npx -y npm@10.9.2 ci --ignore-scripts", {
    stdio: "inherit",
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
  });
} catch {
  console.error("");
  console.error(
    "npm ci failed with npm 10. package-lock.json is out of sync with package.json.",
  );
  console.error("Run: npm run lockfile:sync");
  process.exit(1);
}

console.log("package-lock.json is in sync.");
