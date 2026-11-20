/**
 * Prepara copias Git INDEPENDIENTES de las dos implementaciones publicadas.
 * Nunca modifica los workspaces de referencia ni sobrescribe demos existentes.
 * El nuevo commit es un snapshot: NO recupera los commits históricos del ensayo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const names = ['david-gsd', 'jorge-speckit'];
const outputRoot = path.join(root, 'demos');
const targets = names.map((name) => ({
  name, source: path.join(root, 'workspaces', name), destination: path.join(outputRoot, name),
}));

function git(args, cwd) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', windowsHide: true, timeout: 90000 });
  if (r.error || r.status !== 0) {
    throw new Error('git ' + args.join(' ') + ': ' + (r.stderr || r.error?.message || r.stdout || 'error desconocido'));
  }
  return r.stdout.trim();
}

try {
  for (const { source, destination, name } of targets) {
    if (!fs.existsSync(source)) throw new Error('Falta el snapshot publicado: ' + source);
    if (fs.existsSync(destination)) throw new Error('La demo ya existe (no se sobrescribe): ' + destination);
  }
  const identity = git(['config', '--get', 'user.name'], root);
  const email = git(['config', '--get', 'user.email'], root);
  if (!identity || !email) throw new Error('Configura git user.name y user.email antes de preparar las demos');
  fs.mkdirSync(outputRoot, { recursive: true });
  for (const { source, destination, name } of targets) {
    fs.cpSync(source, destination, {
      recursive: true,
      filter: (p) => {
        const rel = path.relative(source, p).split(path.sep);
        return !rel.some((part) => ['.git', 'node_modules', 'dist', 'playwright-report', 'test-results'].includes(part));
      },
    });
    git(['init', '-b', 'main'], destination);
    git(['add', '-A'], destination);
    git(['commit', '-m', 'chore: isolated demo baseline from published ' + name + ' snapshot'], destination);
    console.log('✓ ' + name + ': ' + path.relative(root, destination));
    console.log('  Git root: ' + git(['rev-parse', '--show-toplevel'], destination));
    console.log('  Commit:   ' + git(['rev-parse', '--short', 'HEAD'], destination));
  }
  console.log('\nLas demos son copias independientes. Historial original NO incluido.');
  console.log('Siguiente: cd demos/david-gsd (o demos/jorge-speckit), npm ci, npm run dev');
} catch (err) {
  console.error('ERROR: ' + err.message);
  process.exitCode = 1;
}
