/**
 * Inventario canónico de imágenes usadas en la landing.
 * Sincroniza assets-source → public y elimina archivos huérfanos.
 */
import { copyFile, mkdir, readdir, rm, stat } from 'fs/promises';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_IMAGES = join(ROOT, 'public', 'images');
const SOURCE_IMAGES = join(ROOT, 'assets-source', 'images');

/** Rutas relativas a images/ (sin leading slash) */
const USED = [
  'sections/01-header/logo-mobile.svg',
  'sections/02-hero/bg-fondo-carga.png',
  'sections/02-hero/bg-fondo-carga-mobile.png',
  'sections/02-hero/hero-visual.png',
  'sections/02-hero/ellipse.svg',
  'sections/02-hero/icon-lock.svg',
  'sections/02-hero/icon-asesoria.svg',
  'sections/02-hero/icon-entregas.svg',
  'sections/02-hero/icon-experiencia.svg',
  'sections/02-hero/icon-seguridad.svg',
  'sections/03-what-is/bg-wave.png',
  'sections/03-what-is/icon-box.svg',
  'sections/03-what-is/step-01.png',
  'sections/03-what-is/step-02.png',
  'sections/03-what-is/step-03.png',
  'sections/03-what-is/step-04.png',
  'sections/04-key-benefit/container.png',
  'sections/05-how-it-works/path.svg',
  'sections/05-how-it-works/chevron-down.svg',
  'sections/05-how-it-works/icon-phase-1.svg',
  'sections/05-how-it-works/icon-phase-2.svg',
  'sections/05-how-it-works/icon-phase-3.svg',
  'sections/05-how-it-works/step-01.png',
  'sections/05-how-it-works/step-02.png',
  'sections/05-how-it-works/step-03.png',
  'sections/05-how-it-works/step-04.png',
  'sections/05-how-it-works/step-05.png',
  'sections/05-how-it-works/step-06.png',
  'sections/05-how-it-works/step-07.png',
  'sections/05-how-it-works/step-08.png',
  'sections/05-how-it-works/step-09.png',
  'sections/05-how-it-works/step-10.png',
  'sections/05-how-it-works/step-11.png',
  'sections/05-how-it-works/step-12.png',
  'sections/06-warranty/shield.png',
  'sections/06-warranty/icon-check.svg',
  'sections/07-why-choose/card-top-1.png',
  'sections/07-why-choose/card-top-2.png',
  'sections/07-why-choose/card-top-3.png',
  'sections/07-why-choose/card-bottom-1.png',
  'sections/07-why-choose/card-bottom-2.png',
  'sections/07-why-choose/card-bottom-3.png',
  'sections/07-why-choose/card-top-1-mobile.png',
  'sections/07-why-choose/card-top-2-mobile.png',
  'sections/07-why-choose/card-top-3-mobile.png',
  'sections/07-why-choose/card-bottom-1-mobile.png',
  'sections/07-why-choose/card-bottom-2-mobile.png',
  'sections/07-why-choose/card-bottom-3-mobile.png',
  'sections/08-testimonials/card-1.png',
  'sections/08-testimonials/card-2.png',
  'sections/08-testimonials/card-3.png',
  'sections/08-testimonials/card-4.png',
  'sections/08-testimonials/play.svg',
  'sections/09-maritime/bg-ship.png',
  'sections/10-contact/photo.png',
  'sections/10-contact/photo-mobile.png',
  'sections/10-contact/icon-check.svg',
  'sections/12-footer/logo-large.svg',
  'sections/12-footer/logo-ccl.svg',
  'sections/12-footer/icon-china.svg',
  'sections/shared/icon-quote.svg',
];

const USED_SET = new Set(USED);

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function copyIfExists(from, to) {
  if (!(await exists(from))) return false;
  await mkdir(dirname(to), { recursive: true });
  await copyFile(from, to);
  return true;
}

async function syncPair(rel) {
  const pub = join(PUBLIC_IMAGES, rel);
  const src = join(SOURCE_IMAGES, rel);
  const hasPub = await exists(pub);
  const hasSrc = await exists(src);

  if (hasPub && !hasSrc) {
    await copyIfExists(pub, src);
    console.log(`↑ source ← public  ${rel}`);
  } else if (hasSrc && !hasPub) {
    await copyIfExists(src, pub);
    console.log(`↓ public ← source  ${rel}`);
  } else if (!hasPub && !hasSrc) {
    console.warn(`⚠ faltante en ambos: ${rel}`);
  }
}

async function cleanDir(baseDir, label) {
  const files = await walkFiles(baseDir);
  for (const file of files) {
    const rel = relative(baseDir, file).replace(/\\/g, '/');
    if (!USED_SET.has(rel)) {
      await rm(file);
      console.log(`✗ ${label}  ${rel}`);
    }
  }

  // Remove empty directories (bottom-up)
  const dirs = new Set(files.map((f) => dirname(f)));
  for (const dir of [...dirs].sort((a, b) => b.length - a.length)) {
    if (dir === baseDir) continue;
    try {
      const remaining = await readdir(dir);
      if (remaining.length === 0) {
        await rm(dir);
        const relDir = relative(baseDir, dir).replace(/\\/g, '/');
        console.log(`✗ ${label} dir  ${relDir}/`);
      }
    } catch {
      /* already removed */
    }
  }
}

console.log('=== Sincronizando pares public ↔ assets-source ===\n');
for (const rel of USED) {
  await syncPair(rel);
}

console.log('\n=== Limpiando public/images ===\n');
await cleanDir(PUBLIC_IMAGES, 'public');

console.log('\n=== Limpiando assets-source/images ===\n');
await cleanDir(SOURCE_IMAGES, 'source');

console.log(`\n✓ ${USED.length} assets canónicos listos.`);
