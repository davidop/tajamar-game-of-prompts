import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i < 0 ? null : args[i + 1]; };
const framework = get('--framework');
const name = get('--name');
if (!['spec-kit','gsd'].includes(framework) || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{1,39}$/.test(name || '')) {
  console.error('Uso: npm run setup -- --framework spec-kit|gsd --name alumno01');
  process.exit(2);
}
const output = path.join(root, 'workspaces', name);
if (fs.existsSync(output)) {
  console.error(`Ya existe ${output}. No se sobrescribe ningún trabajo previo.`);
  process.exit(3);
}
const run = (cmd, argv, cwd=root) => spawnSync(cmd, argv, {
  cwd, encoding: 'utf8', timeout: 15000, windowsHide: true
});
const version = run('git', ['--version']);
if (version.status !== 0 || version.error) {
  console.error('No se encuentra Git. Instala Git antes de crear el workspace.');
  process.exit(4);
}
for (const key of ['user.name', 'user.email']) {
  const result = run('git', ['config', '--get', key]);
  if (result.status !== 0 || !result.stdout?.trim()) {
    console.error(`Falta git config ${key}. Configura tu identidad Git antes de continuar.`);
    process.exit(5);
  }
}
fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, 'starter'), output, { recursive: true });
fs.mkdirSync(path.join(output, 'docs'));
fs.mkdirSync(path.join(output, 'prompts'));
fs.copyFileSync(path.join(root, 'docs', '02-documento-funcional.md'), path.join(output, 'docs', '02-documento-funcional.md'));
for (const file of ['prompt-comun.md', 'prompt-verificacion.md']) {
  fs.copyFileSync(path.join(root, 'prompts', file), path.join(output, 'prompts', file));
}
const source = framework === 'spec-kit' ? '10-ruta-speckit.md' : '11-ruta-gsd.md';
fs.copyFileSync(path.join(root, 'docs', source), path.join(output, 'docs', 'guia-casa.md'));
fs.writeFileSync(path.join(output, 'WORKSHOP.md'), `# Mi entrega de TaskForge

Casa: **${framework}**

1. Lee [PRD](docs/02-documento-funcional.md) y [ruta elegida](docs/guia-casa.md).
2. Instala únicamente el framework seleccionado y abre Copilot CLI.
3. Desarrolla la aplicación siguiendo el proceso del framework.
4. Valida con npm run build y prepara una demo.
5. Guarda evidencias, pruebas y decisiones; no publiques soluciones en el repositorio docente.
`);
for (const step of [
  ['git', ['init', '-b', 'main']],
  ['git', ['add', '-A']],
  ['git', ['commit', '-m', 'chore: initial TaskForge starter baseline']]
]) {
  const res = run(step[0], step[1], output);
  if (res.status !== 0 || res.error) {
    console.error(`No se pudo ejecutar ${step[0]} ${step[1].join(' ')}:`);
    console.error(res.stderr || res.error?.message || '');
    console.error('El workspace se ha creado. Revisa Git manualmente; no continúes con GSD sin un commit inicial.');
    process.exit(6);
  }
}
console.log(`✓ Workspace creado: ${output}
✓ Casa: ${framework}
✓ Git independiente inicializado con commit base.
Siguiente: cd workspaces/${name} && npm install && npm run dev`);
