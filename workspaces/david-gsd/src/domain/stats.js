// Pure helpers for filtering and progress. No DOM, no storage.

export function filterTasks(tasks, filter) {
  if (filter === 'pending') return tasks.filter((t) => t.status === 'pending');
  if (filter === 'completed') return tasks.filter((t) => t.status === 'completed');
  return tasks.slice();
}

// Assumption D-04: percentage uses Math.round (12.5 -> 13); 0 tasks -> 0.
export function progressPercent(tasks) {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === 'completed').length;
  return Math.round((done / tasks.length) * 100);
}
