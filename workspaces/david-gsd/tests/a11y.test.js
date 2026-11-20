import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), 'utf8');
const stripComments = (text) =>
  text
    .split(/\r?\n/)
    .filter((l) => {
      const t = l.trim();
      return !(t.startsWith('//') || t.startsWith('*') || t.startsWith('/*'));
    })
    .join('\n');
const code = (p) => stripComments(read(p));
const uiFiles = readdirSync(join(root, 'src', 'ui'))
  .filter((n) => n.endsWith('.js') && statSync(join(root, 'src', 'ui', n)).isFile())
  .map((n) => `src/ui/${n}`);

// ---- WCAG contrast ----
function luminance(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((x) => x + x).join('');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const css = read('src/style.css');
// Returns the hex value of `prop` inside the first rule whose selector matches.
function cssColor(selector, prop) {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rule = css.match(new RegExp(`(?:^|\\})\\s*${esc}\\s*\\{([^}]*)\\}`, 'm'));
  assert.ok(rule, `CSS rule ${selector} not found`);
  const m = rule[1].match(new RegExp(`(?:^|[;\\s])${prop}\\s*:\\s*(#[0-9a-fA-F]{3,6})\\b`));
  assert.ok(m, `${prop} not found in ${selector}`);
  return m[1];
}

test('contrast helper sanity (black/white = 21)', () => {
  assert.ok(Math.abs(contrast('#000000', '#ffffff') - 21) < 0.01);
});

test('text/background pairs meet WCAG AA 4.5:1 (A11Y-02)', () => {
  const pairs = [
    ['body text', cssColor('body', 'color'), cssColor('body', 'background')],
    ['body text on shell', cssColor('body', 'color'), cssColor('.shell', 'background')],
    ['button', cssColor('button', 'color'), cssColor('button', 'background')],
    ['input', cssColor('input, textarea, button', 'color'), cssColor('input, textarea, button', 'background')],
    ['form error', cssColor('.form-error', 'color'), cssColor('.shell', 'background')],
    ['empty state', cssColor('.empty-state', 'color'), cssColor('.shell', 'background')],
    ['status pending', cssColor('body', 'color'), cssColor('.status-pending', 'background')],
    ['status completed', cssColor('body', 'color'), cssColor('.status-completed', 'background')],
    ['dialog', cssColor('dialog', 'color'), cssColor('dialog', 'background')],
  ];
  for (const [name, fg, bg] of pairs) {
    const ratio = contrast(fg, bg);
    assert.ok(ratio >= 4.5, `${name}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 < 4.5`);
  }
});

test('focus outline has >= 3:1 contrast on white and is not removed (A11Y-01)', () => {
  const m = css.match(/:focus-visible\s*\{[^}]*outline:\s*\d+px\s+solid\s+(#[0-9a-fA-F]{6})/);
  assert.ok(m, ':focus-visible outline not found');
  assert.ok(contrast(m[1], '#ffffff') >= 3, 'focus outline contrast < 3:1');
  const removals = [...css.matchAll(/([^{}]+)\{[^}]*outline:\s*(none|0)\b[^}]*\}/g)].map((x) => x[1].trim());
  assert.deepEqual(removals, ['.shell section:focus'], `outline removed on: ${removals.join(' | ')}`);
});

test('document language, title and h1 exist (D-04)', () => {
  const html = read('index.html');
  assert.match(html, /<html[^>]*lang="es"/);
  assert.match(html, /<title>\s*\S[^<]*<\/title>/);
  assert.match(code('src/main.js'), /createElement\('h1'\)/);
});

test('only native buttons receive click listeners; no role=button; no positive tabindex', () => {
  for (const f of uiFiles) {
    const c = code(f);
    for (const m of c.matchAll(/(\w+)\.addEventListener\(\s*'click'/g)) {
      const v = m[1];
      assert.match(
        c,
        new RegExp(`(?:const|let)\\s+${v}\\s*=\\s*document\\.createElement\\('button'\\)`),
        `${f}: click listener on non-button ${v}`,
      );
    }
    assert.ok(!/role['"]?,?\s*['"]button/.test(c), `${f}: role=button used`);
    assert.ok(!/tabindex['"]?,\s*['"][1-9]/.test(c), `${f}: positive tabindex`);
  }
  const main = code('src/main.js');
  assert.ok(!/tabindex['"]?,\s*['"][1-9]/.test(main), 'main.js: positive tabindex');
});

test('form fields have labels bound by htmlFor and buttons have names', () => {
  const c = code('src/ui/taskForm.js');
  for (const id of ['task-title', 'task-description']) {
    assert.match(c, new RegExp(`\\.htmlFor\\s*=\\s*'${id}'`), `label for ${id} missing`);
    assert.match(c, new RegExp(`\\.id\\s*=\\s*'${id}'`), `element id ${id} missing`);
  }
  assert.match(c, /submit\.textContent\s*=\s*'[^']+'/);
  assert.match(code('src/ui/confirmDialog.js'), /cancel\.textContent\s*=\s*'Cancelar'/);
  assert.match(code('src/ui/confirmDialog.js'), /confirm\.textContent\s*=\s*'Eliminar'/);
  assert.match(code('src/ui/filterBar.js'), /b\.textContent\s*=/);
});

test('toggle/delete aria-labels start with the visible text (label-in-name)', () => {
  const c = code('src/ui/taskList.js');
  assert.match(c, /toggle\.setAttribute\('aria-label',\s*`\$\{toggle\.textContent\}\s/);
  assert.match(c, /del\.textContent\s*=\s*'Eliminar'/);
  assert.match(c, /del\.setAttribute\('aria-label',\s*`Eliminar\s/);
});

test('dialog is named via aria-labelledby; filter group has aria-label', () => {
  assert.match(code('src/ui/confirmDialog.js'), /setAttribute\('aria-labelledby',\s*messageId\)/);
  assert.match(code('src/ui/filterBar.js'), /setAttribute\('aria-label',\s*'Filtrar tareas'\)/);
});

test('validation error is announced and linked to the input', () => {
  const c = code('src/ui/taskForm.js');
  assert.match(c, /error\.setAttribute\('role',\s*'alert'\)/);
  assert.match(c, /error\.id\s*=\s*'task-title-error'/);
  assert.match(c, /title\.setAttribute\('aria-describedby',\s*error\.id\)/);
  assert.match(c, /title\.setAttribute\('aria-invalid',\s*'true'\)/);
  assert.match(c, /title\.removeAttribute\('aria-invalid'\)/);
});

test('state is conveyed by text, not only color (D-03)', () => {
  const list = code('src/ui/taskList.js');
  assert.ok(list.includes("'Pendiente'") && list.includes("'Completada'"));
  assert.ok(code('src/ui/filterBar.js').includes('✓'), 'active filter marker missing');
  assert.ok(code('src/ui/progress.js').includes('Progreso: '), 'progress text missing');
});
