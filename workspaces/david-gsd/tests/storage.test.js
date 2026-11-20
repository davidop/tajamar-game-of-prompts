import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, loadTasks, saveTasks } from '../src/state/storage.js';

function fake(initial) {
  const data = new Map();
  if (initial !== undefined) data.set(STORAGE_KEY, initial);
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, v),
  };
}

const good = { id: '1', title: 'abc', description: '', status: 'pending', createdAt: '2026-01-01T00:00:00.000Z' };

test('key is taskforge.v1', () => assert.equal(STORAGE_KEY, 'taskforge.v1'));

test('loadTasks returns [] for missing/corrupt/non-array data', () => {
  assert.deepEqual(loadTasks(fake()), []);
  assert.deepEqual(loadTasks(fake('{bad')), []);
  assert.deepEqual(loadTasks(fake('null')), []);
  assert.deepEqual(loadTasks(fake('{"a":1}')), []);
});

test('loadTasks drops malformed items and keeps valid ones', () => {
  const raw = JSON.stringify([good, { ...good, id: '2', title: undefined }, { ...good, id: '3', status: 'x' }, null, 5]);
  assert.deepEqual(loadTasks(fake(raw)), [good]);
});

test('loadTasks never throws when getItem throws', () => {
  assert.deepEqual(loadTasks({ getItem() { throw new Error('boom'); } }), []);
});

test('saveTasks round-trips', () => {
  const s = fake();
  assert.equal(saveTasks([good], s), true);
  assert.deepEqual(loadTasks(s), [good]);
});

test('saveTasks returns false when setItem throws', () => {
  assert.equal(saveTasks([good], { setItem() { throw new Error('quota'); } }), false);
});
