import {
  validateTitle,
  createTask,
  toggleTask,
  removeTask,
  filterTasks,
  computeProgress,
} from './tasks.js';
import { loadTasks, saveTasks } from './storage.js';

const FILTERS = [
  { id: 'all', label: 'Todas', testid: 'filter-all' },
  { id: 'pending', label: 'Pendientes', testid: 'filter-pending' },
  { id: 'completed', label: 'Completadas', testid: 'filter-completed' },
];

const EMPTY_MESSAGES = {
  all: 'No hay tareas todavía. ¡Añade la primera!',
  pending: 'No hay tareas pendientes.',
  completed: 'No hay tareas completadas.',
};

export function initUI(root) {
  let tasks = loadTasks();
  let filter = 'all';

  root.innerHTML = `
    <main class="shell">
      <h1>TaskForge</h1>
      <form id="task-form" novalidate>
        <div class="field">
          <label for="task-title">Título</label>
          <input id="task-title" data-testid="task-title" type="text" autocomplete="off"
                 aria-describedby="form-error" />
        </div>
        <div class="field">
          <label for="task-description">Descripción (opcional)</label>
          <textarea id="task-description" data-testid="task-description" rows="2"></textarea>
        </div>
        <p id="form-error" class="error" role="alert"></p>
        <button type="submit" data-testid="task-submit">Crear tarea</button>
      </form>
      <section aria-label="Progreso" class="progress">
        Progreso: <strong id="progress-value" data-testid="progress-value">0%</strong>
      </section>
      <div class="filters" role="group" aria-label="Filtrar por estado"></div>
      <p id="empty-state" class="empty"></p>
      <ul id="task-list" class="task-list"></ul>
    </main>
  `;

  const form = root.querySelector('#task-form');
  const titleInput = root.querySelector('#task-title');
  const descInput = root.querySelector('#task-description');
  const errorEl = root.querySelector('#form-error');
  const progressEl = root.querySelector('#progress-value');
  const filtersEl = root.querySelector('.filters');
  const emptyEl = root.querySelector('#empty-state');
  const listEl = root.querySelector('#task-list');

  for (const f of FILTERS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = f.label;
    btn.dataset.testid = f.testid;
    btn.dataset.filter = f.id;
    btn.addEventListener('click', () => {
      filter = f.id;
      render();
    });
    filtersEl.append(btn);
  }

  function commit(next) {
    tasks = next;
    saveTasks(tasks);
    render();
  }

  function render() {
    progressEl.textContent = `${computeProgress(tasks)}%`;

    for (const btn of filtersEl.children) {
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter));
    }

    const visible = filterTasks(tasks, filter);
    emptyEl.textContent = visible.length === 0 ? EMPTY_MESSAGES[filter] : '';
    listEl.replaceChildren();

    for (const task of visible) {
      const done = task.status === 'completed';
      const li = document.createElement('li');
      li.dataset.testid = 'task-item';
      li.className = done ? 'task done' : 'task';

      const body = document.createElement('div');
      body.className = 'task-body';
      const title = document.createElement('strong');
      title.textContent = task.title;
      const status = document.createElement('span');
      status.className = 'status';
      status.textContent = done ? '✔ Completada' : '○ Pendiente';
      body.append(title, status);
      if (task.description) {
        const desc = document.createElement('p');
        desc.textContent = task.description;
        body.append(desc);
      }

      const actions = document.createElement('div');
      actions.className = 'task-actions';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.dataset.testid = 'task-toggle';
      toggle.textContent = done ? 'Reabrir' : 'Completar';
      toggle.setAttribute('aria-label', `${toggle.textContent}: ${task.title}`);
      toggle.addEventListener('click', () => commit(toggleTask(tasks, task.id)));

      const del = document.createElement('button');
      del.type = 'button';
      del.dataset.testid = 'task-delete';
      del.textContent = 'Eliminar';
      del.setAttribute('aria-label', `Eliminar: ${task.title}`);
      del.addEventListener('click', () => {
        if (window.confirm(`¿Eliminar la tarea "${task.title}"?`)) {
          commit(removeTask(tasks, task.id));
        }
      });

      actions.append(toggle, del);
      li.append(body, actions);
      listEl.append(li);
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = validateTitle(titleInput.value);
    if (!result.valid) {
      errorEl.textContent = result.error;
      titleInput.setAttribute('aria-invalid', 'true');
      titleInput.focus();
      return;
    }
    errorEl.textContent = '';
    titleInput.removeAttribute('aria-invalid');
    commit([...tasks, createTask(result.value, descInput.value)]);
    titleInput.value = '';
    descInput.value = '';
    titleInput.focus();
  });

  render();
}
