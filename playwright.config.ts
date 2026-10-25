import { defineConfig, devices } from "@playwright/test";

// Smoke tests run against a deployed site, never a local build.
// Set SITE_URL to target a mirror, e.g. https://rafikbahri.github.io
export default defineConfig({
  testDir: "./tests/smoke",
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.SITE_URL ?? "https://rafikbahri.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
