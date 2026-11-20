import { defineConfig } from '@playwright/test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const allowed = ['workspaces/david-gsd', 'workspaces/jorge-speckit', 'demos/david-gsd', 'demos/jorge-speckit'];
const workspace = process.env.TASKFORGE_WORKSPACE || 'workspaces/david-gsd';
if (!allowed.includes(workspace)) throw new Error('TASKFORGE_WORKSPACE no permitido: ' + workspace);

export default defineConfig({
  testDir: '.',
  testMatch: 'acceptance.spec.js',
  timeout: 20000,
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    headless: true,
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --strictPort',
    cwd: resolve(root, workspace),
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 45000,
  },
});
