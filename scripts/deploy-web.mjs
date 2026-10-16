import { execSync } from 'child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { join, dirname, extname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const TARGET =
  process.env.DEPLOY_TARGET ??
  'C:/xampp/htdocs/probusiness.pe/carga_consolidada';

function clearDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    rmSync(join(dir, entry.name), { recursive: true, force: true });
  }
}

function assetPrefix(filePath, targetDir) {
  const relDir = relative(targetDir, dirname(filePath)).replace(/\\/g, '/');
  const depth =
    relDir === '.' || relDir === '' ? 0 : relDir.split('/').filter(Boolean).length;
  return depth === 0 ? '' : '../'.repeat(depth);
}

function rewriteForDeploy(content, filePath, targetDir) {
  const prefix = assetPrefix(filePath, targetDir);
  const graciasPath = `${prefix}gracias`;
  const homePath = prefix || './';

  return content
    .replace(/"\/carga_consolidada\/_astro\//g, `"${prefix}_astro/`)
    .replace(/'\/carga_consolidada\/_astro\//g, `'${prefix}_astro/`)
    .replace(/"\/_astro\//g, `"${prefix}_astro/`)
    .replace(/'\/_astro\//g, `'${prefix}_astro/`)
    .replace(/href="\/carga_consolidada\/gracias"/g, `href="${graciasPath}"`)
    .replace(/data-gracias-path="\/carga_consolidada\/gracias"/g, `data-gracias-path="${graciasPath}"`)
    .replace(/\?\?"\/carga_consolidada\/gracias"/g, `??"${graciasPath}"`)
    .replace(/href="\/gracias"/g, `href="${graciasPath}"`)
    .replace(/data-gracias-path="\/gracias"/g, `data-gracias-path="${graciasPath}"`)
    .replace(/\?\?"\/gracias"/g, `??"${graciasPath}"`)
    .replace(/href="\/carga_consolidada\/"/g, `href="${homePath}"`)
    .replace(/href="\/" class="btn-primary/g, `href="${homePath}" class="btn-primary`);
}

function walkFiles(dir) {
  const files = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function patchDeployedAssets(targetDir) {
  const patchExt = new Set(['.html', '.js', '.css']);
  let patched = 0;

  for (const filePath of walkFiles(targetDir)) {
    if (!patchExt.has(extname(filePath))) continue;

    const original = readFileSync(filePath, 'utf8');
    const updated = rewriteForDeploy(original, filePath, targetDir);
    if (updated === original) continue;

    writeFileSync(filePath, updated, 'utf8');
    patched += 1;
  }

  return patched;
}

console.log('Building Astro site (sin cambios en el proyecto)...\n');
execSync('npm run build', { stdio: 'inherit', cwd: ROOT, shell: true });

if (!existsSync(DIST)) {
  console.error(`No se generó ${DIST}. Revisa el build.`);
  process.exit(1);
}

console.log(`\nCopiando dist/ → ${TARGET}`);
mkdirSync(TARGET, { recursive: true });
clearDir(TARGET);
cpSync(DIST, TARGET, { recursive: true });

const patched = patchDeployedAssets(TARGET);
console.log(`Rutas relativas aplicadas en ${patched} archivo(s).`);
console.log('\nDeploy completado.');
console.log(`URL local: http://localhost/probusiness.pe/carga_consolidada/`);
