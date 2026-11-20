export function renderTaskForm(store) {
  const form = document.createElement('form');
  form.noValidate = true;
  form.className = 'task-form';

  const titleLabel = document.createElement('label');
  titleLabel.htmlFor = 'task-title';
  titleLabel.textContent = 'Título';
  const title = document.createElement('input');
  title.type = 'text';
  title.id = 'task-title';
  title.name = 'title';
  title.dataset.testid = 'task-title';
  title.setAttribute('data-testid', 'task-title');

  const descLabel = document.createElement('label');
  descLabel.htmlFor = 'task-description';
  descLabel.textContent = 'Descripción (opcional)';
  const desc = document.createElement('textarea');
  desc.id = 'task-description';
  desc.name = 'description';
  desc.rows = 3;
  desc.setAttribute('data-testid', 'task-description');

  const error = document.createElement('p');
  error.id = 'task-title-error';
  error.className = 'form-error';
  error.setAttribute('role', 'alert');
  title.setAttribute('aria-describedby', error.id);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Añadir tarea';
  submit.setAttribute('data-testid', 'task-submit');

  form.append(titleLabel, title, descLabel, desc, error, submit);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = store.addTask(title.value, desc.value);
    if (result.ok) {
      error.textContent = '';
      title.removeAttribute('aria-invalid');
      form.reset();
      title.focus();
    } else {
      error.textContent = result.error;
      title.setAttribute('aria-invalid', 'true');
      title.focus();
    }
  });

  return form;
}
