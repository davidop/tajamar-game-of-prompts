import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative } from 'node:path';

const root = process.cwd();

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const read = (p) => readFileSync(p, 'utf8');
const rel = (f) => relative(root, f).replace(/\\/g, '/');

// Drops whole-line comments (JS and CSS) so words in comments are not flagged.
const stripComments = (text) =>
  text
    .split(/\r?\n/)
    .filter((l) => {
      const t = l.trim();
      return !(t.startsWith('//') || t.startsWith('*') || t.startsWith('/*'));
    })
    .join('\n');

const srcFiles = walk(join(root, 'src'));
const indexHtml = join(root, 'index.html');
const pkgJson = join(root, 'package.json');
const scanned = [...srcFiles, indexHtml, pkgJson];
const codeOf = (f) => (f.endsWith('.js') || f.endsWith('.css') ? stripComments(read(f)) : read(f));

test('no secret patterns in src, index.html or package.json (T-04-04)', () => {
  const patterns = [
    /api[_-]?key/i,
    /secret/i,
    /token/i,
    /password/i,
    /BEGIN (RSA|PRIVATE)/,
    /sk-[A-Za-z0-9]{20,}/,
    /ghp_[A-Za-z0-9]{20,}/,
  ];
  for (const f of scanned) {
    const c = codeOf(f);
    for (const p of patterns) {
      assert.ok(!p.test(c), `secret-like pattern ${p} in ${rel(f)}`);
    }
  }
});

test('no remote APIs or remote assets in src and index.html (T-04-05)', () => {
  const patterns = [
    /fetch\(/,
    /XMLHttpRequest/,
    /WebSocket/,
    /navigator\.sendBeacon/,
    /<script[^>]*src\s*=\s*["']?https?:/i,
    /<link[^>]*href\s*=\s*["']?https?:/i,
    /@import\s+url\(\s*["']?https?:/i,
  ];
  for (const f of [...srcFiles, indexHtml]) {
    const c = codeOf(f);
    for (const p of patterns) {
      assert.ok(!p.test(c), `remote pattern ${p} in ${rel(f)}`);
    }
  }
});

test('no innerHTML/outerHTML/insertAdjacentHTML in src (T-04-06)', () => {
  for (const f of srcFiles.filter((x) => x.endsWith('.js'))) {
    const c = codeOf(f);
    assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML/.test(c), `HTML injection API in ${rel(f)}`);
  }
});

test('no .env files are tracked by git', () => {
  const out = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' });
  const envFiles = out
    .split(/\r?\n/)
    .filter((l) => /(^|\/)\.env(\.|$)/.test(l) && !l.endsWith('.env.example'));
  assert.deepEqual(envFiles, []);
});

test('04-ACCEPTANCE.md has a row for each PRD section 6 criterion 1-7 with evidence and a valid final result', () => {
  const md = read(join(root, '.planning', 'milestones', 'v1.0-phases', '04-accessibility-contract-docs', '04-ACCEPTANCE.md'));
  const rows = md.split(/\r?\n/).filter((l) => /^\|\s*\d\s*\|/.test(l));
  assert.deepEqual(rows.map((r) => r.split('|')[1].trim()), ['1', '2', '3', '4', '5', '6', '7']);
  for (const r of rows) {
    const cells = r.split('|').map((c) => c.trim());
    assert.ok(cells[3].length > 3 && cells[3] !== '—', `row ${cells[1]} lacks automatic evidence`);
    assert.ok(/1\.\s/.test(cells[5]) && /2\.\s/.test(cells[5]), `row ${cells[1]} lacks numbered manual steps`);
    assert.ok(/^(Pendiente de UAT|PASS \(UAT|FAIL)/.test(cells[6]), `row ${cells[1]} has an invalid final result`);
  }
});

test('README documents commands, assumptions and links the acceptance matrix', () => {
  const readme = read(join(root, 'README.md'));
  for (const t of ['npm install', 'npm run dev', 'npm run build', 'npm test', 'Math.round',
    'taskforge.v1', '<dialog>', '04-ACCEPTANCE']) {
    assert.ok(readme.includes(t), `README missing "${t}"`);
  }
});
