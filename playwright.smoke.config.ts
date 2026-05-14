import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/smoke',
  timeout: 30000,
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: {},
    },
  ],
});
