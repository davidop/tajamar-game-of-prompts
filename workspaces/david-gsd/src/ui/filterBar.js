const FILTERS = [
  { key: 'all', label: 'Todas', testid: 'filter-all' },
  { key: 'pending', label: 'Pendientes', testid: 'filter-pending' },
  { key: 'completed', label: 'Completadas', testid: 'filter-completed' },
];

// Buttons are built once and never rebuilt, so focus is never lost on render.
export function renderFilterBar(onChange) {
  const element = document.createElement('div');
  element.className = 'filter-bar';
  element.setAttribute('role', 'group');
  element.setAttribute('aria-label', 'Filtrar tareas');

  const buttons = new Map();
  for (const f of FILTERS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('data-testid', f.testid);
    b.textContent = f.label;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      if (typeof onChange === 'function') onChange(f.key);
    });
    buttons.set(f.key, b);
    element.append(b);
  }

  function setActive(filter) {
    for (const f of FILTERS) {
      const b = buttons.get(f.key);
      const on = f.key === filter;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-active', on);
      // Active state conveyed by a text marker, not only color.
      b.textContent = on ? `✓ ${f.label}` : f.label;
    }
  }

  function getButton(filter) {
    return buttons.get(filter) ?? null;
  }

  return { element, setActive, getButton };
}
