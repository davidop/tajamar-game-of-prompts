import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const stripComments = (text) =>
  text
    .split(/\r?\n/)
    .filter((l) => {
      const t = l.trim();
      return !(t.startsWith('//') || t.startsWith('*') || t.startsWith('/*'));
    })
    .join('\n');

const read = (p) => readFileSync(p, 'utf8');
const srcFiles = walk(join(root, 'src'));
const jsFiles = srcFiles.filter((f) => f.endsWith('.js'));
const code = (f) => stripComments(read(f));
const rel = (f) => relative(root, f).replace(/\\/g, '/');

test('no innerHTML in src (XSS guard)', () => {
  for (const f of jsFiles) {
    assert.ok(!code(f).includes('innerHTML'), `innerHTML found in ${rel(f)}`);
  }
});

test('required data-testid values exist in src/ui', () => {
  const ui = walk(join(root, 'src', 'ui')).map(code).join('\n');
  for (const id of ['task-title', 'task-description', 'task-submit', 'task-item', 'task-toggle',
    'filter-all', 'filter-pending', 'filter-completed', 'progress-value']) {
    assert.ok(ui.includes(id), `missing data-testid ${id}`);
  }
});

test('no remote calls or remote assets in src and index.html', () => {
  const files = [...srcFiles, join(root, 'index.html')];
  for (const f of files) {
    const c = f.endsWith('.html') ? read(f) : stripComments(read(f));
    assert.ok(!/fetch\(|XMLHttpRequest/.test(c), `network API in ${rel(f)}`);
    assert.ok(!/https?:\/\//.test(c), `remote URL in ${rel(f)}`);
    assert.ok(!/@import\s+url\(\s*['"]?(https?:)?\/\//.test(c), `remote @import in ${rel(f)}`);
  }
});

test('index.html keeps lang="es"', () => {
  assert.match(read(join(root, 'index.html')), /<html[^>]*lang="es"/);
});

test('taskForm wires role=alert and aria-describedby', () => {
  const c = code(join(root, 'src/ui/taskForm.js'));
  assert.match(c, /alert/);
  assert.match(c, /aria-describedby/);
});

test('empty-state message exists and is gated on zero tasks', () => {
  const c = code(join(root, 'src/ui/taskList.js'));
  assert.match(c, /length === 0/);
  assert.ok(c.includes('Aún no tienes tareas'), 'empty-state message missing');
});

test('filterBar sets aria-pressed', () => {
  assert.ok(code(join(root, 'src/ui/filterBar.js')).includes('aria-pressed'));
});

test('main.js computes progress from the full list and does not persist the filter (D-02, D-03)', () => {
  const c = code(join(root, 'src/main.js'));
  assert.match(c, /progressPercent\(store\.getTasks\(\)\)/);
  assert.match(c, /filterTasks\(/);
  assert.ok(!c.includes('localStorage') && !c.includes('saveTasks'), 'main.js persists state');
  assert.ok(!code(join(root, 'src/ui/filterBar.js')).includes('localStorage'), 'filterBar persists state');
  assert.ok(!code(join(root, 'src/ui/filterBar.js')).includes('saveTasks'), 'filterBar persists state');
});

test('taskList has a filter-specific empty message distinct from no-tasks message', () => {
  const c = code(join(root, 'src/ui/taskList.js'));
  assert.ok(c.includes('No hay tareas pendientes'));
  assert.ok(c.includes('No hay tareas completadas'));
});

test('main.js wires getFallbackFocus to the active filter button', () => {
  assert.match(code(join(root, 'src/main.js')), /getFallbackFocus/);
});

test('stylesheet defines :focus-visible', () => {
  assert.ok(read(join(root, 'src/style.css')).includes(':focus-visible'));
});

test('only store.js references saveTasks outside storage.js (D-02)', () => {
  for (const f of jsFiles) {
    const r = rel(f);
    if (r === 'src/state/storage.js' || r === 'src/state/store.js') continue;
    assert.ok(!code(f).includes('saveTasks'), `saveTasks referenced in ${r}`);
  }
});

test('delete contract test ids exist in src/ui (DEL-01)', () => {
  const ui = walk(join(root, 'src', 'ui')).map(code).join('\n');
  for (const id of ['task-delete', 'confirm-delete', 'cancel-delete']) {
    assert.ok(ui.includes(id), `missing data-testid ${id}`);
  }
});

test('confirm dialog uses showModal and no native confirm/alert anywhere in src', () => {
  assert.ok(code(join(root, 'src/ui/confirmDialog.js')).includes('showModal'));
  const nativeCall = /window\.confirm|\balert\s*\(|(?<![\w.-])confirm\s*\(/;
  for (const f of jsFiles) {
    assert.ok(!nativeCall.test(code(f)), `native confirm/alert in ${rel(f)}`);
  }
});

test('deleteTask( is only called in the confirmed branch of main.js (DEL-02)', () => {
  const c = code(join(root, 'src/main.js'));
  assert.equal((c.match(/deleteTask\(/g) || []).length, 1, 'deleteTask( must be called exactly once');
  // deleteTask( must sit inside `if (ok) {` of the dialog's resolved promise.
  assert.match(c, /\.open\([^)]*\)\s*\.then\(\s*\(?ok\)?\s*=>\s*\{\s*if\s*\(ok\)\s*\{[^}]*store\.deleteTask\(/);
  // and no deleteTask( call can precede the dialog open call.
  assert.ok(c.indexOf('.open(') < c.indexOf('deleteTask('), 'deleteTask( appears before dialog open');
});

test('taskList wires onDelete but never deletes or persists itself', () => {
  const c = code(join(root, 'src/ui/taskList.js'));
  assert.match(c, /onDelete/);
  assert.ok(!c.includes('deleteTask') && !c.includes('saveTasks'), 'taskList must not delete/persist');
});

test('confirm dialog sets the message through textContent', () => {
  const c = code(join(root, 'src/ui/confirmDialog.js'));
  assert.match(c, /message\.textContent\s*=/);
  assert.ok(!c.includes('innerHTML'));
});

// --- TEST-01 / D-05: data-testid contract by element type (PRD §5) ---
const TESTID_TAGS = [
  ['src/ui/taskForm.js', 'task-title', 'input'],
  ['src/ui/taskForm.js', 'task-description', 'textarea'],
  ['src/ui/taskForm.js', 'task-submit', 'button'],
  ['src/ui/taskList.js', 'task-item', 'li'],
  ['src/ui/taskList.js', 'task-toggle', 'button'],
  ['src/ui/taskList.js', 'task-delete', 'button'],
  ['src/ui/confirmDialog.js', 'confirm-delete', 'button'],
  ['src/ui/confirmDialog.js', 'cancel-delete', 'button'],
  ['src/ui/progress.js', 'progress-value', 'strong'],
];

test('data-testid contract: each id sits on the right element type', () => {
  for (const [file, id, tag] of TESTID_TAGS) {
    const c = code(join(root, file));
    const m = c.match(new RegExp(`(\\w+)\\.setAttribute\\(\\s*'data-testid',\\s*'${id}'\\s*\\)`));
    assert.ok(m, `${id}: setAttribute not found in ${file}`);
    const created = new RegExp(`(?:const|let)\\s+${m[1]}\\s*=\\s*document\\.createElement\\(\\s*'${tag}'\\s*\\)`);
    assert.match(c, created, `${id} must be a <${tag}> in ${file}`);
  }
});

test('data-testid contract: filter ids are buttons built from the FILTERS table', () => {
  const c = code(join(root, 'src/ui/filterBar.js'));
  for (const id of ['filter-all', 'filter-pending', 'filter-completed']) {
    assert.match(c, new RegExp(`testid:\\s*'${id}'`), `${id} missing from FILTERS`);
  }
  assert.match(c, /const b = document\.createElement\('button'\)/);
  assert.match(c, /b\.setAttribute\('data-testid', f\.testid\)/);
});

test('data-testid contract: progress-value text includes %', () => {
  const c = code(join(root, 'src/ui/progress.js'));
  assert.match(c, /value\.textContent\s*=\s*`?\$?\{?[^;]*%/);
});

test('data-testid contract: toggle/delete are created inside the task-item loop', () => {
  const c = code(join(root, 'src/ui/taskList.js'));
  const liAt = c.indexOf("const li = document.createElement('li')");
  const toggleAt = c.indexOf("'task-toggle'", liAt);
  const delAt = c.indexOf("'task-delete'", liAt);
  const endAt = c.indexOf('ul.append(li)');
  assert.ok(liAt >= 0 && endAt > liAt, 'li loop not found');
  assert.ok(toggleAt > liAt && toggleAt < endAt, 'task-toggle outside task-item');
  assert.ok(delAt > liAt && delAt < endAt, 'task-delete outside task-item');
});

test('data-testid contract: confirm/cancel buttons live inside the dialog', () => {
  const c = code(join(root, 'src/ui/confirmDialog.js'));
  assert.match(c, /createElement\('dialog'\)/);
  assert.match(c, /actions\.append\(cancel, confirm\)/);
  assert.match(c, /dialog\.append\(message, actions\)/);
});

test('post-delete focus uses dataset comparison, not id-interpolated selectors (T-03-05)', () => {
  const c = code(join(root, 'src/main.js'));
  assert.match(c, /dataset\.taskId\s*===/);
  assert.ok(!/querySelector\(\s*`[^`]*\$\{/.test(c), 'selector interpolation in main.js');
});
