export const CDN_BASE = 'https://cdn.probusiness.pe/landing_consolidado_v2';

import manifestData from '../../cdn-assets/image-manifest.json';

type ManifestEntry = {
  widths: number[];
  defaultWidth: number;
  hasAvif?: boolean;
};

const manifest = manifestData as Record<string, ManifestEntry>;

export function asset(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${CDN_BASE}${normalized}`;
}

export function stripExtension(path: string): string {
  return path.replace(/\.(png|jpe?g|webp|avif)$/i, '');
}

export function optimizedImage(path: string): string {
  return asset(`${stripExtension(path)}.webp`);
}

export type ResponsiveImageData = {
  fallback: string;
  webpSrcset: string;
  avifSrcset: string;
  sizes: string;
  usePicture: boolean;
};

export function responsiveImage(
  path: string,
  options?: {
    widths?: number[];
    sizes?: string;
    defaultWidth?: number;
  },
): ResponsiveImageData {
  const key = path.startsWith('/') ? path : `/${path}`;
  const entry = manifest[key];
  const sizes = options?.sizes ?? '100vw';

  if (!entry?.widths?.length) {
    return {
      fallback: asset(path),
      webpSrcset: '',
      avifSrcset: '',
      sizes,
      usePicture: false,
    };
  }

  const widths = options?.widths ?? entry.widths;
  const defaultWidth = options?.defaultWidth ?? entry.defaultWidth;
  const base = stripExtension(key);

  const webpSrcset = widths
    .map((width) => `${asset(`${base}-${width}.webp`)} ${width}w`)
    .join(', ');

  const avifSrcset =
    entry.hasAvif === false
      ? ''
      : widths.map((width) => `${asset(`${base}-${width}.avif`)} ${width}w`).join(', ');

  return {
    fallback: asset(`${base}-${defaultWidth}.webp`),
    webpSrcset,
    avifSrcset,
    sizes,
    usePicture: true,
  };
}

export function backgroundImage(path: string, width?: number): string {
  const key = path.startsWith('/') ? path : `/${path}`;
  const entry = manifest[key];

  if (!entry?.widths?.length) {
    return asset(path);
  }

  const targetWidth = width ?? entry.defaultWidth;
  const base = stripExtension(key);
  return asset(`${base}-${targetWidth}.webp`);
}
