import { defineConfig, devices } from "@playwright/test";

// Screenshots para o /revisar comparar com os PNGs de design/. Uso: npm run shots
const port = 5199;
const baseURL = process.env.SHOTS_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: ".",
  testMatch: "shots.spec.ts",
  reporter: "list",
  use: { ...devices["Desktop Chrome"], baseURL, reducedMotion: "reduce" },
  webServer: process.env.SHOTS_BASE_URL
    ? undefined
    : {
        command: `npm run dev -- --port ${port} --strictPort`,
        url: baseURL,
        reuseExistingServer: true,
        cwd: "..",
      },
});
