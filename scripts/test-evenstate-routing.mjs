// No additional test dependencies. Run against a production build with npm run test:evenstate.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import http from 'node:http';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { NextRequest } = require('next/server');
const source = await readFile(new URL('../proxy.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
function route(path, host, env = {}, extraHeaders = {}) {
  const exports = {};
  new Function('require', 'exports', 'process', compiled)(require, exports, { env: { NODE_ENV: 'production', ...env } });
  return exports.proxy(new NextRequest(`http://localhost:3107${path}`, { headers: { host, ...extraHeaders } }));
}

test('exact, case-normalized host matching; query survives; forwarded hosts ignored', () => {
  for (const host of ['evenstate.behelit.dev', 'EVENSTATE.BEHELIT.DEV:443', 'evenstate.localhost:3107']) {
    const response = route('/?source=test&a=one%20two', host);
    const target = new URL(response.headers.get('x-middleware-rewrite'));
    assert.equal(target.pathname, '/evenstate');
    assert.equal(target.search, '?source=test&a=one%20two');
  }
  for (const host of ['behelit.dev', 'www.behelit.dev', 'preview.vercel.app', 'evil-evenstate.behelit.dev', 'evenstate.behelit.dev.attacker.test']) {
    assert.equal(route('/', host, {}, { 'x-forwarded-host': 'evenstate.behelit.dev' }).headers.get('x-middleware-next'), '1');
  }
});
test('local and explicit preview overrides cannot select Evenstate on a production deployment', () => {
  assert.equal(route('/', 'evenstate.localhost', { VERCEL: '1', VERCEL_ENV: 'production' }).headers.get('x-middleware-next'), '1');
  assert.equal(route('/?evenstate-preview=1', 'preview.vercel.app', { VERCEL_ENV: 'production' }).headers.get('x-middleware-next'), '1');
  const preview = route('/?evenstate-preview=1', 'preview.vercel.app', { VERCEL_ENV: 'preview' });
  assert.match(preview.headers.get('x-middleware-rewrite'), /\/evenstate\?evenstate-preview=1$/);
  assert.equal(preview.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.equal(preview.headers.get('cache-control'), 'private, no-store');
  assert.equal(route('/', 'preview.vercel.app', { VERCEL_ENV: 'preview' }).headers.get('x-middleware-next'), '1');
});
test('assets and APIs pass through; unknown product pages remain in the product namespace', () => {
  for (const path of ['/_next/static/test.js', '/_next/image?url=test', '/api', '/api/anything', '/evenstate/assets/hero-brain-body.webp', '/file.svg']) {
    assert.equal(route(path, 'evenstate.behelit.dev').headers.get('x-middleware-next'), '1');
  }
  for (const path of ['/missing', '/soulen/privacy', '/robots.txt', '/sitemap.xml']) {
    assert.equal(new URL(route(path, 'evenstate.behelit.dev').headers.get('x-middleware-rewrite')).pathname, `/evenstate${path}`);
  }
});
test('internal paths redirect once to the canonical host without losing query parameters', () => {
  for (const host of ['behelit.dev', 'www.behelit.dev', 'evenstate.behelit.dev', 'preview.vercel.app']) {
    const response = route('/evenstate?source=internal', host);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), 'https://evenstate.behelit.dev/?source=internal');
    assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  }
  assert.equal(route('/evenstate', 'evenstate.localhost:3107').headers.get('location'), 'http://evenstate.localhost:3107/');
});

const origin = process.argv[2] ?? 'http://localhost:3107';
function request(path, host = 'evenstate.behelit.dev') {
  return new Promise((resolve, reject) => {
    http.get(new URL(path, origin), { headers: { Host: host } }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString() }));
    }).on('error', reject);
  });
}
test('HTTP: distinct host content and metadata remain correct across alternating requests', async () => {
  for (let i = 0; i < 2; i++) {
    for (const host of ['evenstate.behelit.dev', 'behelit.dev', 'www.behelit.dev', 'normal-preview.vercel.app']) {
      const response = await request('/', host);
      assert.equal(response.status, 200);
      if (host === 'evenstate.behelit.dev') {
        assert.match(response.body, /<title>Evenstate — Daily practices for mind and body<\/title>/);
        assert.equal(new URL(response.body.match(/rel="canonical" href="([^"]+)"/)[1]).href, 'https://evenstate.behelit.dev/');
        assert.equal(new URL(response.body.match(/property="og:url" content="([^"]+)"/)[1]).href, 'https://evenstate.behelit.dev/');
        assert.match(response.body, /https:\/\/evenstate.behelit.dev\/evenstate\/assets\/social.png/);
        assert.doesNotMatch(response.body, /paper-grain|font-cormorant/);
      } else {
        assert.match(response.body, /paper-grain/);
        assert.doesNotMatch(response.body, /Make space for your|font-evenstate/);
      }
    }
  }
});
test('HTTP: query rewrite, non-indexable local host, real product 404, no prefix loops', async () => {
  const response = await request('/?campaign=local');
  assert.equal(response.status, 200);
  assert.match(response.headers['x-middleware-rewrite'], /\/evenstate\?campaign=local$/);
  assert.match((await request('/', 'evenstate.localhost:3107')).headers['x-robots-tag'], /noindex/);
  for (const path of ['/missing', '/soulen/privacy', '/privacy/missing', '/terms/missing', '/missing.png']) {
    const missing = await request(path);
    assert.equal(missing.status, 404, path);
    assert.match(missing.body, /A little off the path/);
    assert.doesNotMatch(missing.body, /rel="canonical"/);
  }
  const duplicate = await request('/evenstate?campaign=test', 'behelit.dev');
  assert.equal(duplicate.status, 308);
  assert.equal(duplicate.headers.location, 'https://evenstate.behelit.dev/?campaign=test');
});
test('HTTP: Evenstate legal pages have unique canonicals, correct contact, and host isolation', async () => {
  for (const path of ['/privacy', '/terms', '/support']) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.match(response.body, /app@behelit.dev/);
    assert.doesNotMatch(response.body, /support@behelit.dev/);
    assert.equal(response.body.match(/rel="canonical" href="([^"]+)"/)[1], `https://evenstate.behelit.dev${path}`);
    assert.equal((response.body.match(/<h1[ >]/g) ?? []).length, 1);
    assert.equal((await request(path, 'behelit.dev')).status, 404);
    assert.equal((await request(path, 'www.behelit.dev')).status, 404);
    const duplicate = await request(`/evenstate${path}`, 'behelit.dev');
    assert.equal(duplicate.status, 308);
    assert.equal(duplicate.headers.location, `https://evenstate.behelit.dev${path}`);
    assert.match((await request('/sitemap.xml')).body, new RegExp(`<loc>https://evenstate.behelit.dev${path}</loc>`));
  }
  const home = await request('/');
  for (const path of ['/privacy', '/terms', '/support']) assert.ok(home.body.includes(`href="${path}"`));
});
test('HTTP: legal pages on original host, framework files, public artwork, icons and discovery routes', async () => {
  for (const path of ['/anchor/privacy', '/nox/privacy', '/soulen/privacy', '/soulen/terms', '/soulen/account-deletion', '/bonfire/privacy', '/bonfire/terms']) {
    const response = await request(path, 'www.behelit.dev');
    assert.equal(response.status, 200, path);
    assert.match(response.body, /app@behelit.dev/);
    assert.doesNotMatch(response.body, /support@behelit.dev/);
  }
  const home = await request('/');
  const stylesheet = home.body.match(/href="([^\"]+\.css[^\"]*)"/)[1].replaceAll('&amp;', '&');
  assert.equal((await request(stylesheet)).status, 200);
  for (const path of ['/evenstate/assets/hero-brain-body.webp', '/evenstate/assets/social.png', '/favicon.ico', '/icon.png', '/apple-icon.png', '/robots.txt', '/sitemap.xml', '/_next/image?url=%2Fevenstate%2Fassets%2Fbrain-sculpture.webp&w=640&q=75']) {
    assert.equal((await request(path)).status, 200, path);
  }
  assert.match((await request('/robots.txt')).body, /Sitemap: https:\/\/evenstate.behelit.dev\/sitemap.xml/);
  assert.match((await request('/sitemap.xml')).body, /<loc>https:\/\/evenstate.behelit.dev\/<\/loc>/);
  // Behelit had no robots, sitemap or APIs before this change; do not add product responses there.
  for (const path of ['/robots.txt', '/sitemap.xml', '/api/not-implemented']) {
    assert.equal((await request(path, 'behelit.dev')).status, 404, path);
  }
});
