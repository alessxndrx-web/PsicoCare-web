import { defineConfig } from "@playwright/test";
import { randomBytes } from "node:crypto";
process.env.PC_TEST_ADMIN_EMAIL ??= "equipo@psicocare.test";
process.env.PC_TEST_ADMIN_PASSWORD ??= "e2e-" + randomBytes(12).toString("hex");
process.env.PC_TEST_DATABASE_URL ??= process.env.E2E_DATABASE_URL ?? "postgres://psicocare:psicocare@localhost:55432/psicocare_e2e";
export default defineConfig({
  testDir: "./tests/e2e", fullyParallel: false, workers: 1, timeout: 90000, expect: { timeout: 20000 },
  use: { baseURL: "http://127.0.0.1:3100", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure", screenshot: "only-on-failure", reducedMotion: "reduce" },
  webServer: {
    command: "npx tsx scripts/e2e-server.ts", url: "http://127.0.0.1:3100", timeout: 300000, reuseExistingServer: false,
    env: {
      DATABASE_URL: process.env.PC_TEST_DATABASE_URL!,
      SITE_URL: "http://127.0.0.1:3100",
      PC_TEST_ADMIN_EMAIL: process.env.PC_TEST_ADMIN_EMAIL!,
      PC_TEST_ADMIN_PASSWORD: process.env.PC_TEST_ADMIN_PASSWORD!,
      NEXT_DIST_DIR: ".next-e2e",
    },
  },
});
