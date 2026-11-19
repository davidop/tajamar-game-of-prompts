export const STORAGE_KEY = 'taskforge.tasks.v1';

function isValidTask(t) {
  return (
    t &&
    typeof t === 'object' &&
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    (t.status === 'pending' || t.status === 'completed')
  );
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(isValidTask).map((t) => ({
      id: t.id,
      title: t.title,
      description: typeof t.description === 'string' ? t.description : '',
      status: t.status,
      createdAt: typeof t.createdAt === 'number' ? t.createdAt : 0,
    }));
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage unavailable or full: keep working in memory.
  }
}
