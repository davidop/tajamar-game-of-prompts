export function renderProgress() {
  const element = document.createElement('p');
  element.className = 'progress';
  element.setAttribute('role', 'status');
  element.append(document.createTextNode('Progreso: '));
  const value = document.createElement('strong');
  value.setAttribute('data-testid', 'progress-value');
  value.textContent = '0%';
  element.append(value);

  return {
    element,
    update(percent) {
      value.textContent = `${percent}%`;
    },
  };
}
