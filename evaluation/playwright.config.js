import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.',
  testMatch: 'acceptance.spec.js',
  timeout: 18000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    headless: true,
    browserName: 'chromium',
  },
});
