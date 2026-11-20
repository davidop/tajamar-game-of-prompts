import { validateTitle, createTask } from '../domain/tasks.js';
import { saveTasks } from './storage.js';

export function createStore(initialTasks = [], storage = globalThis.localStorage) {
  let tasks = Array.isArray(initialTasks) ? [...initialTasks] : [];
  const listeners = new Set();

  const notify = () => listeners.forEach((fn) => fn());

  return {
    getTasks: () => [...tasks],
    addTask(title, description) {
      const result = validateTitle(title);
      if (!result.valid) return { ok: false, error: result.error };
      tasks = [...tasks, createTask(result.value, description)];
      saveTasks(tasks, storage);
      notify();
      return { ok: true };
    },
    toggleTask(id) {
      if (!tasks.some((t) => t.id === id)) return { ok: false };
      tasks = tasks.map((t) =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t,
      );
      saveTasks(tasks, storage);
      notify();
      return { ok: true };
    },
    deleteTask(id) {
      if (!tasks.some((t) => t.id === id)) return { ok: false };
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks(tasks, storage);
      notify();
      return { ok: true };
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
