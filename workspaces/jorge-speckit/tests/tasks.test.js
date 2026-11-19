import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateTitle,
  createTask,
  toggleTask,
  removeTask,
  filterTasks,
  computeProgress,
} from '../src/tasks.js';
import { loadTasks, saveTasks, STORAGE_KEY } from '../src/storage.js';

const mk = (title, status = 'pending') => ({ ...createTask(title), status });

describe('validateTitle / createTask', () => {
  it('rejects 2 and 81 characters, accepts 3 and 80', () => {
    expect(validateTitle('ab').valid).toBe(false);
    expect(validateTitle('a'.repeat(81)).valid).toBe(false);
    expect(validateTitle('abc').valid).toBe(true);
    expect(validateTitle('a'.repeat(80)).valid).toBe(true);
  });
  it('rejects whitespace-only and trims', () => {
    expect(validateTitle('     ').valid).toBe(false);
    expect(validateTitle('  hola  ').value).toBe('hola');
    expect(validateTitle(`  ${'a'.repeat(80)}  `).valid).toBe(true);
  });
  it('creates pending tasks and allows duplicates', () => {
    const a = createTask('Mismo', 'x');
    const b = createTask('Mismo');
    expect(a.status).toBe('pending');
    expect(a.id).not.toBe(b.id);
  });
});

describe('storage', () => {
  beforeEach(() => {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
    };
  });
  it('round-trips', () => {
    const t = [mk('Tarea uno')];
    saveTasks(t);
    expect(loadTasks()).toEqual(t);
  });
  it('handles corrupted data', () => {
    localStorage.setItem(STORAGE_KEY, '{oops');
    expect(loadTasks()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, '{"a":1}');
    expect(loadTasks()).toEqual([]);
  });
  it('drops invalid entries', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([mk('Valida'), { id: 1 }, null]));
    expect(loadTasks()).toHaveLength(1);
  });
});

describe('toggle / progress', () => {
  it('toggles preserving content', () => {
    const t = [mk('Tarea')];
    const done = toggleTask(t, t[0].id);
    expect(done[0].status).toBe('completed');
    expect(done[0].title).toBe('Tarea');
    expect(toggleTask(done, t[0].id)[0].status).toBe('pending');
  });
  it('computes rounded progress', () => {
    expect(computeProgress([])).toBe(0);
    expect(computeProgress([mk('aaa', 'completed'), mk('bbb')])).toBe(50);
    expect(computeProgress([mk('aaa', 'completed'), mk('bbb'), mk('ccc')])).toBe(33);
    expect(computeProgress([mk('aaa', 'completed'), mk('bbb', 'completed'), mk('ccc')])).toBe(67);
  });
});

describe('remove / filter', () => {
  it('removes only the target', () => {
    const t = [mk('aaa'), mk('bbb')];
    expect(removeTask(t, t[0].id)).toEqual([t[1]]);
  });
  it('filters keeping order and without mutating', () => {
    const t = [mk('aaa'), mk('bbb', 'completed'), mk('ccc')];
    const copy = [...t];
    expect(filterTasks(t, 'pending').map((x) => x.title)).toEqual(['aaa', 'ccc']);
    expect(filterTasks(t, 'completed')).toHaveLength(1);
    expect(filterTasks(t, 'all')).toHaveLength(3);
    expect(t).toEqual(copy);
  });
});
