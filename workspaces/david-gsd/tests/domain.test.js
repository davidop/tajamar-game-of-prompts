import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTitle, createTask } from '../src/domain/tasks.js';

test('validateTitle rejects empty, blank and too short', () => {
  for (const raw of ['', '   ', 'ab', '  ab  ']) {
    const r = validateTitle(raw);
    assert.equal(r.valid, false, JSON.stringify(raw));
    assert.equal(typeof r.error, 'string');
  }
});

test('validateTitle accepts trimmed 3..80', () => {
  assert.deepEqual(validateTitle('abc'), { valid: true, value: 'abc', error: null });
  assert.equal(validateTitle('  abc  ').value, 'abc');
  assert.equal(validateTitle('a'.repeat(80)).valid, true);
  assert.equal(validateTitle('a'.repeat(81)).valid, false);
  assert.equal(validateTitle(`  ${'a'.repeat(80)}  `).valid, true);
});

test('createTask builds a pending task', () => {
  const a = createTask('  Hola  ');
  const b = createTask('Hola', ' desc ');
  assert.equal(a.status, 'pending');
  assert.equal(a.title, 'Hola');
  assert.equal(a.description, '');
  assert.equal(b.description, 'desc');
  assert.notEqual(a.id, b.id);
  assert.ok(!Number.isNaN(Date.parse(a.createdAt)));
});
