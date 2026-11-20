let dialogCounter = 0;

export function createConfirmDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'confirm-dialog';
  const messageId = `confirm-dialog-msg-${++dialogCounter}`;
  dialog.setAttribute('aria-labelledby', messageId);

  const message = document.createElement('p');
  message.id = messageId;
  message.className = 'confirm-dialog-message';

  const actions = document.createElement('div');
  actions.className = 'confirm-dialog-actions';

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.setAttribute('data-testid', 'cancel-delete');
  cancel.textContent = 'Cancelar';
  cancel.addEventListener('click', () => dialog.close('cancel'));

  const confirm = document.createElement('button');
  confirm.type = 'button';
  confirm.setAttribute('data-testid', 'confirm-delete');
  confirm.textContent = 'Eliminar';
  confirm.addEventListener('click', () => dialog.close('confirm'));

  actions.append(cancel, confirm);
  dialog.append(message, actions);

  function open(taskTitle, returnFocusEl) {
    if (dialog.open) return Promise.resolve(false);
    message.textContent = `¿Eliminar la tarea "${taskTitle}"?`;
    dialog.returnValue = '';
    return new Promise((resolve) => {
      dialog.addEventListener(
        'close',
        () => {
          const ok = dialog.returnValue === 'confirm';
          if (!ok && returnFocusEl && returnFocusEl.isConnected) returnFocusEl.focus();
          resolve(ok);
        },
        { once: true },
      );
      dialog.showModal();
    });
  }

  return { element: dialog, open };
}
