const STATUS_LABEL = { pending: 'Pendiente', completed: 'Completada' };

const TOGGLE_LABEL = { pending: 'Completar', completed: 'Reabrir' };

// Returns the id of the task whose toggle button currently has focus, or null.
function focusedToggleId(container) {
  const active = document.activeElement;
  if (!active || !container.contains(active)) return null;
  if (active.getAttribute('data-testid') !== 'task-toggle') return null;
  const li = active.closest('li');
  return li && li.dataset.taskId ? li.dataset.taskId : null;
}

// Restore focus after a rebuild. If the toggled item is gone (e.g. removed by
// the active filter), fall back to the active filter button or the list container.
function restoreFocus(container, id, handlers) {
  if (id === null) return;
  for (const li of container.querySelectorAll('li')) {
    if (li.dataset.taskId === id) {
      const btn = li.querySelector('button');
      if (btn) {
        btn.focus();
        return;
      }
    }
  }
  const fallback = typeof handlers.getFallbackFocus === 'function' ? handlers.getFallbackFocus() : null;
  if (fallback && typeof fallback.focus === 'function') {
    fallback.focus();
    return;
  }
  if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');
  container.focus();
}

const FILTER_EMPTY = {
  pending: 'No hay tareas pendientes.',
  completed: 'No hay tareas completadas.',
};

export function renderTaskList(container, tasks, handlers = {}, options = {}) {
  const focusedId = focusedToggleId(container);

  if (tasks.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    if ((options.totalCount ?? 0) === 0) {
      empty.textContent = 'Aún no tienes tareas. Crea la primera con el formulario.';
    } else {
      empty.textContent = FILTER_EMPTY[options.filter] ?? 'No hay tareas para este filtro.';
    }
    container.replaceChildren(empty);
    restoreFocus(container, focusedId, handlers);
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'task-list';
  for (const task of tasks) {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'task-item');
    li.dataset.taskId = task.id;

    const title = document.createElement('strong');
    title.textContent = task.title;
    li.append(title);

    if (task.description) {
      const d = document.createElement('p');
      d.textContent = task.description;
      li.append(d);
    }

    const status = document.createElement('span');
    status.className = `status status-${task.status}`;
    status.textContent = STATUS_LABEL[task.status] ?? task.status;
    li.append(status);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.setAttribute('data-testid', 'task-toggle');
    toggle.className = 'task-toggle';
    toggle.textContent = TOGGLE_LABEL[task.status] ?? TOGGLE_LABEL.pending;
    toggle.setAttribute('aria-label', `${toggle.textContent} tarea: ${task.title}`);
    toggle.addEventListener('click', () => {
      if (typeof handlers.onToggle === 'function') handlers.onToggle(task.id);
    });
    li.append(toggle);

    const del = document.createElement('button');
    del.type = 'button';
    del.setAttribute('data-testid', 'task-delete');
    del.className = 'task-delete';
    del.textContent = 'Eliminar';
    del.setAttribute('aria-label', `Eliminar tarea: ${task.title}`);
    del.addEventListener('click', () => {
      if (typeof handlers.onDelete === 'function') handlers.onDelete(task, del);
    });
    li.append(del);

    ul.append(li);
  }
  container.replaceChildren(ul);
  restoreFocus(container, focusedId, handlers);
}
