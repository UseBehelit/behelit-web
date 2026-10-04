// Run only with an authorized mobile checkout: node scripts/prepare-evenstate-assets.mjs /path/to/evenstate
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { ImageResponse } from 'next/og.js';
import { createElement as h } from 'react';

if (!process.argv[2]) throw new Error('Supply the path to the authorized Evenstate mobile checkout.');
const source = resolve(process.argv[2]);
const destination = resolve('public/evenstate/assets');
await mkdir(destination, { recursive: true });
const artwork = [
  ['assets/onboarding/daily.png', 'hero-brain-body.webp', 1254],
  ['assets/stitch/7fabd0e81ac3.png', 'brain-sculpture.webp', 1024],
  ['assets/stitch/b09323a37c50.png', 'body-sculpture.webp', 1024],
  ['assets/relief/detail/stress.png', 'relief-dunes.webp', 1536],
];
const manifest = [];
for (const [input, output, width] of artwork) {
  const bytes = await readFile(join(source, input));
  const info = await sharp(bytes).metadata();
  const optimized = await sharp(bytes).resize({ width, withoutEnlargement: true }).webp({ quality: 85, alphaQuality: 100 }).toBuffer();
  await writeFile(join(destination, output), optimized);
  manifest.push({ source: input, destination: `public/evenstate/assets/${output}`, sourceFormat: info.format, width: info.width, height: info.height, sourceSha256: createHash('sha256').update(bytes).digest('hex'), sourceBytes: bytes.length, outputBytes: optimized.length });
}
const icon = await readFile(join(source, 'assets/icons/evenstate-icon.png'));
for (const size of [32, 64, 180]) {
  await sharp(icon).resize(size, size).png().toFile(join(destination, `icon-${size}.png`));
}
const hero = await readFile(join(source, 'assets/onboarding/daily.png'));
const font = await readFile('assets/evenstate/fonts/PlusJakartaSans-600.ttf');
const social = new ImageResponse(h('div', { style: { display: 'flex', width: '100%', height: '100%', background: '#FCF9F3', color: '#1C1C18', padding: 64, fontFamily: 'Jakarta', position: 'relative' } },
  h('div', { style: { display: 'flex', flexDirection: 'column', width: 610, justifyContent: 'space-between' } },
    h('div', { style: { fontSize: 30, color: '#385C4B' } }, 'Evenstate'),
    h('div', { style: { fontSize: 65, lineHeight: 1.14, letterSpacing: -3 } }, 'Make space for your mind and body.'),
    h('div', { style: { fontSize: 22, color: '#414844' } }, 'Daily practice. Moment-to-moment support.')),
  h('img', { src: `data:image/png;base64,${hero.toString('base64')}`, width: 510, height: 510, style: { position: 'absolute', right: 4, top: 80 } })),
  { width: 1200, height: 630, fonts: [{ name: 'Jakarta', data: font, weight: 600, style: 'normal' }] });
await writeFile(join(destination, 'social.png'), Buffer.from(await social.arrayBuffer()));
await writeFile('assets/evenstate/provenance.json', `${JSON.stringify({ mobileCommit: '975162c882e924c8af63d54c2e3022ffd4b75a6d', artwork: manifest, icon: { source: 'assets/icons/evenstate-icon.png', outputs: [32, 64, 180].map(size => `public/evenstate/assets/icon-${size}.png`) }, social: 'New 1200×630 composition made with Next ImageResponse, the authorized onboarding artwork, and licensed Plus Jakarta Sans.' }, null, 2)}\n`);
console.log(manifest.map(item => `${item.destination}: ${item.outputBytes} bytes (source ${item.sourceBytes})`).join('\n'));
