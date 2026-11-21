import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let errors=[];
// Evidence must be committed as actual PNG files, not broken or placeholder links.
for (const name of ['gsd-core.png', 'spec-kit.png']) {
  const relative = `assets/screenshots/${name}`;
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) { errors.push(`Falta captura real: ${relative}`); continue; }
  const bytes = fs.readFileSync(full);
  if (bytes.length < 1000 || !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) errors.push(`PNG inválido: ${relative}`);
}
for (const readme of ['README.md','README.en.md']) {
  const body = fs.readFileSync(path.join(root,readme),'utf8');
  for (const name of ['gsd-core.png','spec-kit.png']) if (!body.includes(`assets/screenshots/${name}`)) errors.push(`Falta enlace a ${name} en ${readme}`);
}

// Check local Markdown targets in both entrypoints (including image references).
for (const readme of ['README.md', 'README.en.md']) {
  const body = fs.readFileSync(path.join(root, readme), 'utf8');
  const linkPattern = /!?\\[[^\\]]*\\]\\(([^)]+)\\)/g;
  for (const match of body.matchAll(linkPattern)) {
    const target = match[1].split('#')[0].trim();
    if (!target || /^(https?:|mailto:|#)/i.test(target)) continue;
    const decoded = decodeURIComponent(target);
    const full = path.resolve(root, decoded);
    if (!full.startsWith(root + path.sep) || !fs.existsSync(full)) {
      errors.push(\`Enlace local roto en \${readme}: \${target}\`);
    }
  }
}
// The public dashboard bundles images from the same source evidence in Pages CI.
const dashboard = fs.readFileSync(path.join(root, 'dashboard/index.html'), 'utf8');
for (const image of ['screenshots/gsd-core.png', 'screenshots/spec-kit.png']) {
  if (!dashboard.includes(image)) errors.push(\`Dashboard sin captura: \${image}\`);
}

const required = ['README.md','LICENSE','starter/package.json','starter/index.html','starter/src/main.js','docs/02-documento-funcional.md','docs/10-ruta-speckit.md','docs/11-ruta-gsd.md','evaluation/acceptance.spec.js','results/scoreboard.html','presentation/index.html','.github/workflows/quality.yml'];
for(const relative of required) if(!fs.existsSync(path.join(root,relative))) errors.push(`Falta ${relative}`);
for(const relative of ['docs/03-cambio-sorpresa.md','prompts/prompt-cambio.md']) if(fs.existsSync(path.join(root,relative))) errors.push(`Se ha filtrado el spoiler: ${relative}`);
let starter = fs.readFileSync(path.join(root,'starter/src/main.js'),'utf8');
if(starter.includes('task-submit') || starter.includes('localStorage')) errors.push('El starter parece contener implementación de la solución');
let prd = fs.readFileSync(path.join(root,'docs/02-documento-funcional.md'),'utf8');
for(const id of ['RF-01','RF-02','RF-03','RF-04','RF-05','RF-06','RF-07','RNF-01','RNF-02','task-title','task-submit','task-item','task-toggle','task-delete','progress-value']) if(!prd.includes(id)) errors.push(`Falta contrato: ${id}`);
for(const relative of ['package.json','starter/package.json','evaluation/package.json']) { try { JSON.parse(fs.readFileSync(path.join(root,relative),'utf8')); } catch(e) { errors.push(`JSON inválido: ${relative}`); } }
if(errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`✓ Kit validado (${required.length} archivos esenciales, PRD, contrato, sin solución ni spoiler)`);
