import test from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY } from '../src/state/storage.js';
import { createStore } from '../src/state/store.js';
import { createTask } from '../src/domain/tasks.js';
import { progressPercent } from '../src/domain/stats.js';

function fake() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, v),
  };
}

function setup() {
  const storage = fake();
  const task = createTask('Estudiar', 'Capítulo 3');
  const store = createStore([task], storage);
  return { storage, task, store };
}

test('toggleTask flips pending <-> completed', () => {
  const { store, task } = setup();
  assert.deepEqual(store.toggleTask(task.id), { ok: true });
  assert.equal(store.getTasks()[0].status, 'completed');
  store.toggleTask(task.id);
  assert.equal(store.getTasks()[0].status, 'pending');
});

test('toggleTask leaves title, description, id, createdAt untouched', () => {
  const { store, task } = setup();
  store.toggleTask(task.id);
  let t = store.getTasks()[0];
  for (const k of ['title', 'description', 'id', 'createdAt']) assert.equal(t[k], task[k]);
  store.toggleTask(task.id);
  t = store.getTasks()[0];
  for (const k of ['title', 'description', 'id', 'createdAt']) assert.equal(t[k], task[k]);
});

test('toggleTask persists to storage under taskforge.v1', () => {
  const { store, storage, task } = setup();
  store.toggleTask(task.id);
  const saved = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.equal(saved[0].status, 'completed');
  assert.equal(saved[0].title, task.title);
});

test('toggleTask with unknown id returns ok:false, no change, no notify', () => {
  const { store, storage } = setup();
  let calls = 0;
  store.subscribe(() => calls++);
  assert.deepEqual(store.toggleTask('nope'), { ok: false });
  assert.equal(store.getTasks()[0].status, 'pending');
  assert.equal(calls, 0);
  assert.equal(storage.getItem(STORAGE_KEY), null);
});

test('subscribers are notified once per successful toggle', () => {
  const { store, task } = setup();
  let calls = 0;
  store.subscribe(() => calls++);
  store.toggleTask(task.id);
  assert.equal(calls, 1);
  store.toggleTask(task.id);
  assert.equal(calls, 2);
});

test('deleteTask removes the task and keeps the others in order', () => {
  const storage = fake();
  const a = createTask('A', '');
  const b = createTask('B', '');
  const c = createTask('C', '');
  const store = createStore([a, b, c], storage);
  assert.deepEqual(store.deleteTask(b.id), { ok: true });
  assert.deepEqual(store.getTasks(), [a, c]);
});

test('deleteTask persists removal under taskforge.v1', () => {
  const { store, storage, task } = setup();
  store.deleteTask(task.id);
  const saved = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.ok(!saved.some((t) => t.id === task.id));
});

test('deleteTask with unknown id returns ok:false, no change, no notify, no write', () => {
  const { store, storage } = setup();
  let calls = 0;
  store.subscribe(() => calls++);
  assert.deepEqual(store.deleteTask('nope'), { ok: false });
  assert.equal(store.getTasks().length, 1);
  assert.equal(calls, 0);
  assert.equal(storage.getItem(STORAGE_KEY), null);
});

test('deleting the only task leaves empty list and 0% progress', () => {
  const { store, task } = setup();
  store.deleteTask(task.id);
  assert.deepEqual(store.getTasks(), []);
  assert.equal(progressPercent(store.getTasks()), 0);
});

test('deleting the pending task of two gives 100% and notifies once', () => {
  const storage = fake();
  const done = { ...createTask('Hecha', ''), status: 'completed' };
  const pending = createTask('Pend', '');
  const store = createStore([done, pending], storage);
  let calls = 0;
  store.subscribe(() => calls++);
  store.deleteTask(pending.id);
  assert.equal(progressPercent(store.getTasks()), 100);
  assert.equal(calls, 1);
});
