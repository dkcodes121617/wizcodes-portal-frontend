import { execSync } from "node:child_process";

if (process.env.CI || process.env.VERCEL) {
  process.exit(0);
}

execSync("husky", { stdio: "inherit" });
