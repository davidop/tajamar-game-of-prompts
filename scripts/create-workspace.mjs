import fs from 'node:fs';
import path from 'node:path';
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
  console.error(`Ya existe ${output}. No se sobrescribe ningún trabajo de alumno.`);
  process.exit(3);
}
fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, 'starter'), output, { recursive: true });
fs.mkdirSync(path.join(output, 'docs'));
fs.mkdirSync(path.join(output, 'prompts'));
for (const file of ['02-documento-funcional.md']) fs.copyFileSync(path.join(root,'docs',file), path.join(output,'docs',file));
for (const file of ['prompt-comun.md','prompt-verificacion.md']) fs.copyFileSync(path.join(root,'prompts',file), path.join(output,'prompts',file));
const source = framework === 'spec-kit' ? '10-ruta-speckit.md' : '11-ruta-gsd.md';
fs.copyFileSync(path.join(root,'docs',source), path.join(output,'docs','guia-casa.md'));
fs.writeFileSync(path.join(output,'WORKSHOP.md'), `# Mi entrega de TaskForge\n\nCasa: **${framework}**\n\n1. Lee [PRD](docs/02-documento-funcional.md) y [ruta elegida](docs/guia-casa.md).\n2. Instala únicamente el framework seleccionado y abre Copilot CLI.\n3. Desarrolla la aplicación con evidencia de especificación y plan.\n4. Valida con npm run build y prepara una demo.\n5. Guarda capturas y notas de verificación.\n`);
console.log(`✓ Workspace creado: ${output}\n✓ Casa: ${framework}\nSiguiente: cd workspaces/${name} && npm install && npm run dev`);
