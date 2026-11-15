import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let errors=[];
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
