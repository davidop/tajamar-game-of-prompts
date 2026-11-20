export const STORAGE_KEY = 'taskforge.v1';

function normalize(item) {
  if (!item || typeof item !== 'object') return null;
  const { id, title, description, status, createdAt } = item;
  if (typeof id !== 'string' || typeof title !== 'string') return null;
  if (status !== 'pending' && status !== 'completed') return null;
  if (typeof createdAt !== 'string') return null;
  if (description !== undefined && typeof description !== 'string') return null;
  return { id, title, description: description ?? '', status, createdAt };
}

export function loadTasks(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw == null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalize).filter(Boolean);
  } catch {
    return [];
  }
}

export function saveTasks(tasks, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
