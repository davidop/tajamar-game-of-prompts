import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from '../evaluation/node_modules/playwright/index.mjs';

const apps = [
  { id: 'gsd-core', cwd: 'workspaces/david-gsd' },
  { id: 'spec-kit', cwd: 'workspaces/jorge-speckit' },
];
await mkdir('assets/screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const app of apps) {
    const child = spawn('npm', ['run', 'dev'], { cwd: app.cwd, stdio: 'pipe', env: process.env });
    try {
      let ready = false;
      for (let i = 0; i < 50; i++) {
        if (child.exitCode !== null) throw new Error(app.id + ' server exited early');
        try {
          const r = await fetch('http://127.0.0.1:5173/');
          if (r.ok) { ready = true; break; }
        } catch {}
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      if (!ready) throw new Error(app.id + ' server did not start');
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
      await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
      await page.screenshot({ path: 'assets/screenshots/' + app.id + '.png', fullPage: true, animations: 'disabled' });
      await page.close();
    } finally {
      child.kill('SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
} finally { await browser.close(); }
