export const TITLE_MIN = 3;
export const TITLE_MAX = 80;

let counter = 0;
function newId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  counter += 1;
  return `${Date.now()}-${counter}`;
}

export function validateTitle(title) {
  const trimmed = String(title ?? '').trim();
  if (trimmed.length < TITLE_MIN) {
    return { valid: false, value: trimmed, error: `El título debe tener al menos ${TITLE_MIN} caracteres.` };
  }
  if (trimmed.length > TITLE_MAX) {
    return { valid: false, value: trimmed, error: `El título no puede superar ${TITLE_MAX} caracteres.` };
  }
  return { valid: true, value: trimmed, error: '' };
}

export function createTask(title, description = '') {
  return {
    id: newId(),
    title: String(title).trim(),
    description: String(description ?? '').trim(),
    status: 'pending',
    createdAt: Date.now(),
  };
}

export function toggleTask(tasks, id) {
  return tasks.map((t) =>
    t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
  );
}

export function removeTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}

export function filterTasks(tasks, filter) {
  if (filter === 'pending' || filter === 'completed') {
    return tasks.filter((t) => t.status === filter);
  }
  return [...tasks];
}

export function computeProgress(tasks) {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === 'completed').length;
  return Math.round((done / tasks.length) * 100);
}
