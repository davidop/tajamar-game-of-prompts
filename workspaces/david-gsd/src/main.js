import './style.css';

import { loadTasks } from './state/storage.js';
import { createStore } from './state/store.js';
import { renderTaskForm } from './ui/taskForm.js';
import { renderTaskList } from './ui/taskList.js';
import { renderFilterBar } from './ui/filterBar.js';
import { renderProgress } from './ui/progress.js';
import { createConfirmDialog } from './ui/confirmDialog.js';
import { filterTasks, progressPercent } from './domain/stats.js';

const app = document.querySelector('#app');
const store = createStore(loadTasks());

const main = document.createElement('main');
main.className = 'shell';
const h1 = document.createElement('h1');
h1.textContent = 'TaskForge';
const listContainer = document.createElement('section');
listContainer.setAttribute('aria-label', 'Lista de tareas');

// Filter lives in memory only (D-02): never persisted.
let activeFilter = 'all';

const filterBar = renderFilterBar((filter) => {
  activeFilter = filter;
  filterBar.setActive(activeFilter);
  render();
});
const progress = renderProgress();
const confirmDialog = createConfirmDialog();

main.append(h1, renderTaskForm(store), filterBar.element, progress.element, listContainer, confirmDialog.element);
app.replaceChildren(main);

// Post-delete focus (D-06). Same idea as the Phase 2 getFallbackFocus/restoreFocus
// logic: prefer the natural target, else fall back to a stable focusable element
// (here the list container, tabindex=-1). Ids are compared via dataset, never
// interpolated into a selector (T-03-05).
function focusAfterDelete(nextId) {
  if (nextId !== null) {
    for (const li of listContainer.querySelectorAll('li')) {
      if (li.dataset.taskId === nextId) {
        const btn = li.querySelector('[data-testid="task-delete"]');
        if (btn) {
          btn.focus();
          return;
        }
      }
    }
  }
  if (!listContainer.hasAttribute('tabindex')) listContainer.setAttribute('tabindex', '-1');
  listContainer.focus();
}

function confirmAndDelete(task, button) {
  // Compute the next visible task BEFORE deleting (D-06: "next element").
  const visible = filterTasks(store.getTasks(), activeFilter);
  const idx = visible.findIndex((t) => t.id === task.id);
  const next = idx >= 0 ? visible[idx + 1] : undefined;
  const nextId = next ? String(next.id) : null;
  return confirmDialog.open(task.title, button).then((ok) => {
    if (ok) {
      store.deleteTask(task.id);
      focusAfterDelete(nextId);
    }
  });
}

function render() {
  const all = store.getTasks();
  // Progress always uses the FULL list, never the filtered one (D-03).
  progress.update(progressPercent(store.getTasks()));
  renderTaskList(
    listContainer,
    filterTasks(all, activeFilter),
    {
      onToggle: (id) => store.toggleTask(id),
      onDelete: (task, button) => confirmAndDelete(task, button),
      getFallbackFocus: () => filterBar.getButton(activeFilter),
    },
    { filter: activeFilter, totalCount: all.length },
  );
}
store.subscribe(render);
filterBar.setActive('all');
render();
