import { spawnSync } from 'node:child_process';
const checks = [
  ['Node.js >=22', 'node', ['--version']],
  ['npm', 'npm', ['--version']],
  ['Git', 'git', ['--version']],
  ['GitHub Copilot CLI', 'copilot', ['--version']],
  ['Python (Spec Kit)', 'python', ['--version']],
  ['uv (Spec Kit)', 'uv', ['--version']],
  ['Spec Kit CLI (Casa A)', 'specify', ['version']],
];
for (const [name, bin, args] of checks) {
  const r = spawnSync(bin,args,{encoding:'utf8',timeout:5000});
  const okay = !r.error && r.status === 0;
  const detail = (r.stdout || r.stderr || '').trim().split('\n')[0].slice(0,110);
  console.log(`${okay?'✓':'·'} ${name}: ${okay?detail:'No disponible o no instalado'}`);
}
if (parseInt(process.versions.node.split('.')[0])<22) {
  console.error('Se requiere Node.js >=22 para el taller y Copilot CLI.');
  process.exitCode=1;
}
console.log('\nNota: los frameworks no son obligatorios ambos. GSD se instala en el workspace elegido y Copilot requiere login interactivo.');
