import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'cdn-assets');

const bucket = process.env.AWS_S3_BUCKET ?? 'media-probusiness';
const prefix = process.env.AWS_S3_PREFIX ?? 'landing_consolidado_v2';
const dryRun = process.argv.includes('--dryrun');

if (!existsSync(SOURCE)) {
  console.error('No existe cdn-assets/. Ejecuta primero: npm run prepare:cdn');
  process.exit(1);
}

const destination = `s3://${bucket}/${prefix}/`;

// Importante: sin --delete. Solo sube/actualiza archivos locales; no borra nada en S3.
const command = [
  'aws s3 sync',
  `"${SOURCE}/"`,
  `"${destination}"`,
  '--cache-control "public,max-age=31536000,immutable"',
  dryRun ? '--dryrun' : '',
]
  .filter(Boolean)
  .join(' ');

console.log(`Destino: ${destination}`);
console.log(`Modo: ${dryRun ? 'dry-run (sin cambios en S3)' : 'subida real'}`);
console.log('Nota: no se usa --delete; los objetos ya subidos en S3 se conservan.\n');
execSync(command, { stdio: 'inherit', cwd: ROOT, shell: true });
console.log(`\n${dryRun ? 'Dry-run completado.' : 'Subida completada.'}`);
