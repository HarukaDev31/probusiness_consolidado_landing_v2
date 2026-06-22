import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const ASSETS_SOURCE = join(ROOT, 'assets-source', 'images');

/** Assets Figma MCP — nodo 570:219 (actualizar URLs si expiran) */
const ASSETS = {
  'sections/01-header/logo-full.png':
    'https://www.figma.com/api/mcp/asset/2c767eaf-5629-4a40-99a6-685936076692',
  'sections/01-header/logo-icon.png':
    'https://www.figma.com/api/mcp/asset/c398a6aa-6f53-4eb5-9611-921bdc8bbd93',
  'sections/02-hero/bg-fondo-carga.png':
    'https://www.figma.com/api/mcp/asset/f404c4e6-06e1-4c34-a15a-ceadf4fd31d2',
  'sections/02-hero/hero-visual.png':
    'https://www.figma.com/api/mcp/asset/b35544ff-0392-4a84-b610-43f6e709ed54',
  'sections/02-hero/icon-experiencia.svg':
    'https://www.figma.com/api/mcp/asset/e7550fa8-c5e6-4e84-a777-393c9e63dbe6',
  'sections/02-hero/icon-seguridad.svg':
    'https://www.figma.com/api/mcp/asset/5319978e-4f78-4155-a8de-88ad555d24a9',
  'sections/02-hero/icon-entregas.svg':
    'https://www.figma.com/api/mcp/asset/584c84dd-1639-41a0-b573-ba9363cd6376',
  'sections/02-hero/icon-asesoria.svg':
    'https://www.figma.com/api/mcp/asset/39d50776-12a3-478d-903e-08dbfe345b7e',
  'sections/02-hero/icon-lock.svg':
    'https://www.figma.com/api/mcp/asset/3c7a0913-cc75-496a-96a2-4268f8c6714e',
  'sections/02-hero/ellipse.svg':
    'https://www.figma.com/api/mcp/asset/d5a0b4fb-200b-43db-b003-b4fb31c04b6d',
  'sections/03-what-is/icon-box.svg':
    'https://www.figma.com/api/mcp/asset/746a4de1-18c8-4961-b059-c7ac3f792415',
  'sections/03-what-is/bg-wave.png':
    'https://www.figma.com/api/mcp/asset/e9bd09f7-df76-4bcb-a257-48da1516d576',
  'sections/03-what-is/gemini-sprite.png':
    'https://www.figma.com/api/mcp/asset/e894ad9f-15bd-4a7e-a8ea-2ea66edddc2b',
  'sections/04-key-benefit/container.png':
    'https://www.figma.com/api/mcp/asset/6cbb5c04-bfe3-4ec9-9041-980f13d64d70',
  'sections/05-how-it-works/path.svg':
    'https://www.figma.com/api/mcp/asset/69e9d37d-d81f-4f1d-9190-7f3376e6c1c9',
  'sections/05-how-it-works/step-01.png':
    'https://www.figma.com/api/mcp/asset/4f7a3b08-e4a2-42eb-94db-4d5e205b7337',
  'sections/05-how-it-works/step-02.png':
    'https://www.figma.com/api/mcp/asset/76a7c563-3de5-424e-b0e9-4a8fde21c158',
  'sections/05-how-it-works/step-03.png':
    'https://www.figma.com/api/mcp/asset/b7e0cf6e-7b36-497b-bc7b-02d59d209c9e',
  'sections/05-how-it-works/step-04.png':
    'https://www.figma.com/api/mcp/asset/0d71066b-4c71-4976-baa1-baf05668d55d',
  'sections/05-how-it-works/step-05.png':
    'https://www.figma.com/api/mcp/asset/17e2cd9d-4950-4ab0-a424-8ddb184c79cd',
  'sections/05-how-it-works/step-06.png':
    'https://www.figma.com/api/mcp/asset/7af59cb9-4eb5-4551-9028-aa906ec2d90e',
  'sections/05-how-it-works/step-07.png':
    'https://www.figma.com/api/mcp/asset/7fd58f7a-7903-42a4-8957-08cc70df954a',
  'sections/05-how-it-works/step-08.png':
    'https://www.figma.com/api/mcp/asset/20d298d0-7788-493d-aa36-015557c8f106',
  'sections/05-how-it-works/step-09.png':
    'https://www.figma.com/api/mcp/asset/9296c95a-73a3-4065-abf0-10020cd8fa83',
  'sections/05-how-it-works/step-10.png':
    'https://www.figma.com/api/mcp/asset/c7892ab5-4b20-4764-841e-ca7d7c7a1169',
  'sections/05-how-it-works/step-11.png':
    'https://www.figma.com/api/mcp/asset/8219a503-2ffe-4df5-9b2c-44c58fe67c18',
  'sections/05-how-it-works/step-12.png':
    'https://www.figma.com/api/mcp/asset/252a1870-a9fe-41bd-90d1-245e50d0701c',
  'sections/06-warranty/shield.png':
    'https://www.figma.com/api/mcp/asset/bde843d4-b4cd-4032-8e18-4f1c766c6e48',
  'sections/06-warranty/icon-check.svg':
    'https://www.figma.com/api/mcp/asset/948157d8-71cb-48be-bd26-5bbe9c78cc50',
  'sections/07-why-choose/card-top-1.png':
    'https://www.figma.com/api/mcp/asset/90e802df-9515-4ea6-be98-0a6ebc19b5b3',
  'sections/07-why-choose/card-top-2.png':
    'https://www.figma.com/api/mcp/asset/388cbe83-f84c-4260-8909-727b32e9b0d6',
  'sections/07-why-choose/card-top-3.png':
    'https://www.figma.com/api/mcp/asset/e10a9d0d-2673-499c-bb47-e8796e9e241d',
  'sections/07-why-choose/card-bottom-1.png':
    'https://www.figma.com/api/mcp/asset/3ee6ae8e-f340-47a6-85d1-bb02265b50e8',
  'sections/07-why-choose/card-bottom-2.png':
    'https://www.figma.com/api/mcp/asset/9c3f4653-bbc7-4762-9235-6a510be2bd09',
  'sections/07-why-choose/card-bottom-3.png':
    'https://www.figma.com/api/mcp/asset/cf953b7e-ab4f-475c-b513-aebb4f3d9b8b',
  'sections/08-testimonials/card-1.png':
    'https://www.figma.com/api/mcp/asset/ffe7040b-1c0b-4d50-b6fd-bb1c52296906',
  'sections/08-testimonials/card-2.png':
    'https://www.figma.com/api/mcp/asset/1d9516f7-be0b-4301-a58e-be1cb57b1699',
  'sections/08-testimonials/card-3.png':
    'https://www.figma.com/api/mcp/asset/9ab07159-5de3-4b31-817e-912e876898d8',
  'sections/08-testimonials/card-4.png':
    'https://www.figma.com/api/mcp/asset/e104f294-5180-4ecf-984e-405aff0eedd0',
  'sections/08-testimonials/play.svg':
    'https://www.figma.com/api/mcp/asset/2f3c72f1-5040-4d1d-b414-7cdc558e6ee2',
  'sections/09-maritime/bg-ship.png':
    'https://www.figma.com/api/mcp/asset/1d1fd1a3-d057-48fa-b989-4e7762e09b03',
  'sections/10-contact/photo.png':
    'https://www.figma.com/api/mcp/asset/c83b9f69-d560-4000-9fd8-d2238d6dbd52',
  'sections/10-contact/puntos.svg':
    'https://www.figma.com/api/mcp/asset/db5de5ae-71a4-40a3-bc4b-09a49963c020',
  'sections/10-contact/chevron.svg':
    'https://www.figma.com/api/mcp/asset/4dd1e951-6f13-4cc8-bc5f-928b4560f2f3',
  'sections/10-contact/icon-check.svg':
    'https://www.figma.com/api/mcp/asset/984a85ac-d2be-4860-b8a1-a255832aadaf',
  'sections/11-faq/icon-chevron.svg':
    'https://www.figma.com/api/mcp/asset/4dd1e951-6f13-4cc8-bc5f-928b4560f2f3',
  'sections/12-footer/logo-large.png':
    'https://www.figma.com/api/mcp/asset/36ba1c21-93fb-4a1a-94b4-ef7480a69317',
  'sections/12-footer/logo-ccl.png':
    'https://www.figma.com/api/mcp/asset/ae8e5200-657a-41ab-92be-3cb5ef80a239',
  'sections/12-footer/icon-china.svg':
    'https://www.figma.com/api/mcp/asset/0234372a-3f08-40b5-aad2-dd0490b1b43e',
  'sections/shared/icon-quote.svg':
    'https://www.figma.com/api/mcp/asset/4d101239-2e0a-4862-9095-fe7bbbd8f92a',
  'favicon.svg':
    'https://www.figma.com/api/mcp/asset/c398a6aa-6f53-4eb5-9611-921bdc8bbd93',
};

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  console.log(`✓ ${dest.replace(ROOT, '')}`);
}

for (const [rel, url] of Object.entries(ASSETS)) {
  const isFavicon = rel === 'favicon.svg';
  const publicDest = isFavicon ? join(PUBLIC, rel) : join(PUBLIC, 'images', rel);
  const sourceDest = isFavicon ? join(ROOT, 'assets-source', rel) : join(ASSETS_SOURCE, rel);
  try {
    await download(url, publicDest);
    await download(url, sourceDest);
  } catch (err) {
    console.error(`✗ ${rel}:`, err.message);
  }
}

console.log('\nDescarga completada.');
