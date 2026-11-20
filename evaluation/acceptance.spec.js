import { test, expect } from '@playwright/test';

async function addTask(page, title, description = '') {
  await page.getByTestId('task-title').fill(title);
  if (await page.getByTestId('task-description').count()) {
    await page.getByTestId('task-description').fill(description);
  }
  await page.getByTestId('task-submit').click();
}

async function reset(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.beforeEach(async ({ page }) => { await reset(page); });

test('RF01 RF02: creación y listado', async ({ page }) => {
  await addTask(page, 'Preparar examen', 'Repasar tema 3');
  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await expect(page.getByTestId('task-item').first()).toContainText('Preparar examen');
  await expect(page.getByTestId('task-item').first()).toContainText('Repasar tema 3');
});

test('RF01: no admite título vacío', async ({ page }) => {
  await page.getByTestId('task-title').fill('  ');
  await page.getByTestId('task-submit').click();
  await expect(page.getByTestId('task-item')).toHaveCount(0);
});

test('RF03 RF07: completar, reabrir y porcentaje', async ({ page }) => {
  await addTask(page, 'Preparar examen');
  await addTask(page, 'Entregar proyecto');
  await page.getByTestId('task-item').first().getByTestId('task-toggle').click();
  await expect(page.getByTestId('progress-value')).toContainText('50%');
  await page.getByTestId('task-item').first().getByTestId('task-toggle').click();
  await expect(page.getByTestId('progress-value')).toContainText('0%');
});

test('RF05: filtra pendientes y completadas', async ({ page }) => {
  await addTask(page, 'Preparar examen');
  await addTask(page, 'Entregar proyecto');
  await page.getByTestId('task-item').first().getByTestId('task-toggle').click();
  await page.getByTestId('filter-pending').click();
  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await page.getByTestId('filter-completed').click();
  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await page.getByTestId('filter-all').click();
  await expect(page.getByTestId('task-item')).toHaveCount(2);
});

test('RF06: persiste tras recarga', async ({ page }) => {
  await addTask(page, 'Preparar examen');
  await page.reload();
  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await expect(page.getByTestId('task-item')).toContainText('Preparar examen');
});

test('RF04: cancelar y confirmar eliminación', async ({ page }) => {
  await addTask(page, 'Preparar examen');
  let shouldConfirm = false;
  page.on('dialog', async dialog => {
    if (shouldConfirm) await dialog.accept(); else await dialog.dismiss();
  });
  await page.getByTestId('task-item').first().getByTestId('task-delete').click();
  if (await page.getByTestId('cancel-delete').count()) {
    await page.getByTestId('cancel-delete').click();
  }
  await expect(page.getByTestId('task-item')).toHaveCount(1);
  shouldConfirm = true;
  await page.getByTestId('task-item').first().getByTestId('task-delete').click();
  if (await page.getByTestId('confirm-delete').count()) {
    await page.getByTestId('confirm-delete').click();
  }
  await expect(page.getByTestId('task-item')).toHaveCount(0);
});

test('RF07: con cero tareas el progreso es 0%', async ({ page }) => {
  await expect(page.getByTestId('progress-value')).toContainText('0%');
});

test('RF01: valida longitud mínima y máxima del título', async ({ page }) => {
  await addTask(page, 'ab');
  await expect(page.getByTestId('task-item')).toHaveCount(0);
  await addTask(page, 'a'.repeat(81));
  await expect(page.getByTestId('task-item')).toHaveCount(0);
  await addTask(page, 'abc');
  await expect(page.getByTestId('task-item')).toHaveCount(1);
});

test('RF03 RF06: el estado completado permanece tras recargar', async ({ page }) => {
  await addTask(page, 'Repasar vocabulario');
  await page.getByTestId('task-item').first().getByTestId('task-toggle').click();
  await expect(page.getByTestId('progress-value')).toContainText('100%');
  await page.reload();
  await expect(page.getByTestId('task-item')).toHaveCount(1);
  await expect(page.getByTestId('progress-value')).toContainText('100%');
});

test('Visual evidence: real TaskForge interface', async ({ page }, testInfo) => {
  test.skip(!process.env.CAPTURE_SHOWCASE, 'Opt-in screenshot generation');
  await addTask(page, 'Preparar demo de Tajamar', 'Revisar los requisitos de TaskForge');
  await addTask(page, 'Ejecutar pruebas E2E', 'Validar el mismo contrato de aceptación');
  await addTask(page, 'Publicar resultados', 'Compartir las evidencias con la comunidad');
  await page.getByTestId('task-item').first().getByTestId('task-toggle').click();
  await expect(page.getByTestId('progress-value')).toContainText('33%');
  await page.screenshot({ path: testInfo.outputPath('taskforge-showcase.png'), fullPage: true, animations: 'disabled' });
});
