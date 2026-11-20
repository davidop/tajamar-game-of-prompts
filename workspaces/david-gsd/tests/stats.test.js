import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterTasks, progressPercent } from '../src/domain/stats.js';

const mk = (n, done) =>
  Array.from({ length: n }, (_, i) => ({
    id: String(i),
    title: `t${i}`,
    description: '',
    status: i < done ? 'completed' : 'pending',
    createdAt: i,
  }));

test('progressPercent: zero tasks is 0', () => {
  assert.equal(progressPercent([]), 0);
});

test('progressPercent: rounding with Math.round', () => {
  assert.equal(progressPercent(mk(3, 1)), 33);
  assert.equal(progressPercent(mk(2, 1)), 50);
  assert.equal(progressPercent(mk(3, 2)), 67);
  assert.equal(progressPercent(mk(8, 1)), 13);
  assert.equal(progressPercent(mk(4, 4)), 100);
  assert.equal(progressPercent(mk(4, 0)), 0);
});

test('filterTasks: all / pending / completed', () => {
  const tasks = mk(4, 1);
  assert.equal(filterTasks(tasks, 'all').length, 4);
  assert.deepEqual(filterTasks(tasks, 'pending').map((t) => t.id), ['1', '2', '3']);
  assert.deepEqual(filterTasks(tasks, 'completed').map((t) => t.id), ['0']);
});

test('filterTasks: does not mutate and unknown filter falls back to all', () => {
  const tasks = mk(3, 1);
  const copy = JSON.parse(JSON.stringify(tasks));
  filterTasks(tasks, 'pending');
  assert.deepEqual(tasks, copy);
  assert.equal(filterTasks(tasks, 'bogus').length, 3);
  assert.equal(filterTasks(tasks, undefined).length, 3);
});

test('progressPercent is independent of filtering', () => {
  const tasks = mk(3, 1);
  const before = progressPercent(tasks);
  filterTasks(tasks, 'pending');
  assert.equal(progressPercent(tasks), before);
});
