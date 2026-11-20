const MIN = 3;
const MAX = 80;
let counter = 0;

export function validateTitle(raw) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (value.length < MIN || value.length > MAX) {
    return { valid: false, value, error: `El título debe tener entre ${MIN} y ${MAX} caracteres` };
  }
  return { valid: true, value, error: null };
}

function newId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  counter += 1;
  return `${Date.now()}-${counter}`;
}

export function createTask(title, description = '') {
  return {
    id: newId(),
    title: String(title ?? '').trim(),
    description: typeof description === 'string' ? description.trim() : '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}
