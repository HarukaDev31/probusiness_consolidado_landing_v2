import sharp from 'sharp';
import { readdir, mkdir, copyFile, writeFile, stat, access } from 'fs/promises';
import { join, dirname, relative, extname, parse } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INPUT = join(ROOT, 'assets-source', 'images');
const OUTPUT = join(ROOT, 'cdn-assets', 'images');
const MANIFEST_PATH = join(ROOT, 'cdn-assets', 'image-manifest.json');

const WEBP_QUALITY = 80;
const AVIF_QUALITY = 55;
const WIDTH_CANDIDATES = [400, 480, 600, 768, 960, 1280, 1440, 1920];

const FOLDER_MAX = {
  '01-header': 400,
  '02-hero': 1920,
  '03-what-is': 960,
  '04-key-benefit': 1280,
  '05-how-it-works': 768,
  '06-warranty': 600,
  '07-why-choose': 600,
  '08-testimonials': 600,
  '09-maritime': 1920,
  '10-contact': 768,
  '12-footer': 500,
};

const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function sectionFolder(relDir) {
  const parts = relDir.split(/[/\\]/).filter(Boolean);
  return parts.find((part) => /^\d{2}-/.test(part)) ?? parts.at(-1) ?? '';
}

function pickWidths(sourceWidth, relDir, filename) {
  const section = sectionFolder(relDir);
  const folderMax = FOLDER_MAX[section] ?? 1920;
  const maxW = Math.min(sourceWidth, folderMax);
  let candidates = WIDTH_CANDIDATES.filter((w) => w <= maxW);

  if (candidates.length === 0) {
    candidates = [maxW];
  }

  if (maxW <= 500 || /logo|icon|bullet|play-icon|chevron|divider/i.test(filename)) {
    return [maxW];
  }

  if (candidates.length <= 3) {
    return candidates;
  }

  const first = candidates[0];
  const mid = candidates[Math.floor(candidates.length / 2)];
  const last = candidates[candidates.length - 1];
  return [...new Set([first, mid, last])];
}

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function optimizeRaster(filePath, relFromImages, manifest) {
  const { name: filename } = parse(filePath);
  const relDir = dirname(relFromImages);
  const stem = parse(filename).name;
  const outDir = join(OUTPUT, relDir);
  const publicPath = `/images/${relFromImages.replace(/\\/g, '/')}`;

  await mkdir(outDir, { recursive: true });

  const meta = await sharp(filePath).metadata();
  const sourceWidth = meta.width ?? 1920;
  const widths = pickWidths(sourceWidth, relDir, filename);
  const hasAvif = widths.length > 1 || sourceWidth > 600;

  for (const width of widths) {
    const pipeline = sharp(filePath).resize(width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });

    const webpOut = join(outDir, `${stem}-${width}.webp`);
    await pipeline.clone().webp({ quality: WEBP_QUALITY }).toFile(webpOut);

    if (hasAvif) {
      const avifOut = join(outDir, `${stem}-${width}.avif`);
      await sharp(filePath)
        .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
        .avif({ quality: AVIF_QUALITY })
        .toFile(avifOut);
    }
  }

  const defaultWidth = widths[widths.length - 1];
  const defaultWebp = join(outDir, `${stem}-${defaultWidth}.webp`);
  const flatWebp = join(outDir, `${stem}.webp`);
  await copyFile(defaultWebp, flatWebp);

  if (hasAvif) {
    const defaultAvif = join(outDir, `${stem}-${defaultWidth}.avif`);
    const flatAvif = join(outDir, `${stem}.avif`);
    await copyFile(defaultAvif, flatAvif);
  }

  manifest[publicPath] = {
    widths,
    defaultWidth,
    hasAvif,
  };

  const { size: originalSize } = await stat(filePath);
  const { size: optimizedSize } = await stat(flatWebp);
  const saved = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

  console.log(
    `✓ ${publicPath} → ${widths.join(', ')}px (${(originalSize / 1024).toFixed(0)}KB → ${(optimizedSize / 1024).toFixed(0)}KB, -${saved}%)`,
  );
}

async function copyStatic(filePath, relFromImages) {
  const outputPath = join(OUTPUT, relFromImages);
  await ensureDir(outputPath);
  await copyFile(filePath, outputPath);

  const publicPath = `/images/${relFromImages.replace(/\\/g, '/')}`;
  console.log(`→ ${publicPath} (sin cambios)`);
}

async function main() {
  try {
    await access(INPUT);
  } catch {
    console.error(`No existe ${INPUT}. Coloca los originales en assets-source/images/ antes de optimizar.`);
    process.exit(1);
  }

  const files = await walk(INPUT);
  const manifest = {};
  let rasterCount = 0;
  let staticCount = 0;

  console.log(`Optimizando imágenes de ${INPUT}\n`);

  for (const filePath of files) {
    const relFromImages = relative(INPUT, filePath);
    const ext = extname(filePath).toLowerCase();

    if (RASTER_EXT.has(ext)) {
      await optimizeRaster(filePath, relFromImages, manifest);
      rasterCount += 1;
      continue;
    }

    await copyStatic(filePath, relFromImages);
    staticCount += 1;
  }

  const favicon = join(ROOT, 'assets-source', 'favicon.svg');
  try {
    await stat(favicon);
    const faviconOut = join(ROOT, 'cdn-assets', 'favicon.svg');
    await ensureDir(faviconOut);
    await copyFile(favicon, faviconOut);
    console.log('→ /favicon.svg (sin cambios)');
  } catch {
    // favicon opcional
  }

  await mkdir(dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`\nListo: ${rasterCount} raster optimizadas, ${staticCount} estáticos copiados.`);
  console.log(`Salida: cdn-assets/`);
  console.log(`Manifest: cdn-assets/image-manifest.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
