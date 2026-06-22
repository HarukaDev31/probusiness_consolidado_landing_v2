import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'cdn-assets');

const bucket = process.env.AWS_S3_BUCKET ?? 'media-probusiness';
const prefix = process.env.AWS_S3_PREFIX ?? 'landing_consolidado_v2';

if (!existsSync(SOURCE)) {
  console.error('No existe cdn-assets/. Ejecuta primero: npm run optimize:images');
  process.exit(1);
}

const destination = `s3://${bucket}/${prefix}/`;
const command = [
  'aws s3 sync',
  `"${SOURCE}/"`,
  `"${destination}"`,
  '--cache-control "public,max-age=31536000,immutable"',
].join(' ');

console.log(`Subiendo a ${destination}\n`);
execSync(command, { stdio: 'inherit', cwd: ROOT, shell: true });
console.log('\nSubida completada.');
