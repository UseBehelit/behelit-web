# Evenstate marketing website handoff

Implemented locally on 2026-10-04 for `https://evenstate.behelit.dev/`. No push, merge, deployment, Vercel/account change, domain assignment, or DNS change was performed.

## Implementation and scope

- Next.js **16.3.6**, App Router, React 19, existing Vercel project. Consulted the installed Next.js documentation for Proxy, local fonts, Image, metadata, route handlers, and not-found behavior.
- `app/evenstate/page.tsx`: server-rendered editorial landing page, exact product positioning, Brain/Body artwork, a clearly marked illustrative completion panel, honest platform note, on-device routine section, and Behelit links.
- `app/evenstate/layout.tsx` and `globals.css`: independent root layout, scoped Plus Jakarta Sans, palette and responsive styling; no Behelit theme changes.
- `components/evenstate/ReliefChoices.tsx`: the only new interactive island. Native buttons with `aria-pressed`, keyboard support and an announced description. Describes the mobile app's starting points; no web exercise session, symptom assessment, audio playback or data collection.
- `proxy.ts`: the single host-routing layer, replacing the scaffold rewrite in `next.config.ts`.
- `app/evenstate/[...path]/page.tsx` and `not-found.tsx`: actual 404 for unknown Evenstate paths, including unpublished legal paths.
- `app/evenstate/robots.txt/route.ts`, `sitemap.xml/route.ts`: product-only discovery endpoints.
- `scripts/test-evenstate-routing.mjs`: built-in Node test runner plus existing TypeScript compiler; no added dependencies.
- No new analytics. Existing analytics packages are installed but no active shared analytics components were found in the inspected web layouts. The website makes no blanket tracking or encryption guarantees.
- Existing Behelit homepage, typography, product/legal pages, metadata and static files are untouched. There was no `vercel.json`, Proxy/middleware, API route, robots or sitemap beyond the scaffold's rewrite; normal unknown-host/preview behavior remains Behelit.

The user's supplied copy contained truncated words/sentences. These were repaired using the supplied factual baseline and source-confirmed practice names/settings, without expanding product claims.

## Evidence and asset handoff

Read-only mobile source: `/Users/turkero/Desktop/behelit/evenstate`, HEAD `975162c882e924c8af63d54c2e3022ffd4b75a6d`. The theme, current artwork imports, practice labels and preferences were cross-checked in the working tree. This is source inspection, not a mobile runtime or release-device test. The audited uncommitted mobile UI is not reproduced or presented as screenshots.

All image outputs live under `public/evenstate/assets/`:

| Mobile source | Web destination | Processing |
| --- | --- | --- |
| `assets/onboarding/daily.png` | `hero-brain-body.webp` | 1254×1254, WebP quality 85, alpha quality 100; transparency preserved; 980,201 → 114,760 bytes |
| `assets/stitch/7fabd0e81ac3.png` | `brain-sculpture.webp` | Detected actual JPEG; 1024×1024 WebP, warm matte retained; 52,601 → 16,458 bytes |
| `assets/stitch/b09323a37c50.png` | `body-sculpture.webp` | Detected actual JPEG; 1024×1024 WebP, warm matte retained; 50,278 → 12,808 bytes |
| `assets/relief/detail/stress.png` | `relief-dunes.webp` | 1536×1024 WebP; 2,047,109 → 105,668 bytes |
| `assets/icons/evenstate-icon.png` | `icon-32.png`, `icon-64.png`, `icon-180.png` | PNG resize derivatives; white background retained |
| Combined onboarding art + Jakarta 600 | `social.png` | New 1200×630 branded composition generated with Next ImageResponse, not a pre-existing mobile screenshot |
| `assets/fonts/PlusJakartaSans-{400,500,600}.ttf` | `assets/evenstate/fonts/PlusJakartaSans-{400,500,600}.ttf` | Exact copies, served by `next/font/local`; no claimed WOFF2 conversion |
| `assets/fonts/PlusJakartaSans-OFL.txt` | `assets/evenstate/fonts/PlusJakartaSans-OFL.txt` | License retained unchanged |

`assets/evenstate/provenance.json` records source formats, dimensions, byte counts and SHA-256 hashes for the artwork. To regenerate derivatives from an authorized checkout:

```sh
node scripts/prepare-evenstate-assets.mjs /path/to/evenstate
```

The four main images total **249,694 bytes**, down from 3,130,189 bytes. Next Image additionally delivers responsive optimized sizes. Only the hero is preloaded; other imagery is lazy-loaded. Font weights 400/500/600 are the only copied weights. The transparent hero and social image were visually inspected against the warm background. No optional artwork or native runtime was added. Product assets were used under the user's express authorization; the source provenance manifests are not independent third-party legal clearance.

## Routing and indexing

- Only the normalized HTTP `Host` selects the product: exact `evenstate.behelit.dev`, or `evenstate.localhost` in local processes outside Vercel production. Case and numeric ports are normalized. Forwarded-host headers are ignored.
- `/` rewrites to `/evenstate`; `/robots.txt` and `/sitemap.xml` rewrite to their namespaced handlers. Queries survive. Unknown product paths reach the namespaced catch-all and return HTTP 404 rather than a landing-page fallback.
- Direct `/evenstate` and `/evenstate/*` page requests receive a 308 to the production product hostname with the prefix removed. Local Evenstate-host requests redirect locally. There is no apex-domain indexable copy.
- `/evenstate/assets/*`, `/_next/*`, `/api` and `/api/*`, and the existing shared public SVGs bypass product routing. Product `/favicon.ico`, `/icon.png`, `/apple-icon.png` resolve to product PNG derivatives. No existing API was introduced or modified.
- Static Evenstate HTML is a separate route from Behelit HTML and does not render from request-dependent host data. Proxy adds `Vary: Host`; preview/local product responses also receive `X-Robots-Tag: noindex, nofollow` and `Cache-Control: private, no-store`. Repeated alternating local host requests verified content isolation. Deployed CDN cache behavior remains a post-deployment check, not a claim from local testing.
- Homepage canonical and social URLs are fixed to `https://evenstate.behelit.dev/`, never inferred from request headers. Next serializes origin-only canonical/OG URLs without a trailing slash; these normalize to the same `/` URL. Unknown pages have no homepage canonical and are non-indexable.
- Evenstate discovery endpoints list only the production homepage. Behelit's existing absence of robots/sitemap (404) is preserved.
- On a development server or a Vercel Preview only, `/?evenstate-preview=1` explicitly selects the product. Normal previews still show Behelit. No deployed settings need changing. Production ignores this selector. Product preview metadata and responses are non-indexable. Internal paths still canonicalize; use the documented selector rather than `/evenstate` to preview.

## Reproduce locally

```sh
npm run build
npm start -- --hostname 0.0.0.0 --port 3107
# In another terminal:
npm run test:evenstate
npm run lint
./node_modules/.bin/tsc --noEmit
curl -i -H 'Host: evenstate.behelit.dev' 'http://localhost:3107/?campaign=local'
curl -i -H 'Host: behelit.dev' http://localhost:3107/
curl -i -H 'Host: www.behelit.dev' http://localhost:3107/
curl -i -H 'Host: evenstate.behelit.dev' http://localhost:3107/missing
```

Browser: `http://evenstate.localhost:3107/`. This worked in the verification Chromium browser without an OS hosts change. If another browser cannot resolve the local subdomain, use a dev server (`npm run dev`) and `http://localhost:3000/?evenstate-preview=1`. Do not point real DNS at the local server.

On an existing Vercel Preview: `https://<existing-preview-host>/?evenstate-preview=1`. The preview override and production restrictions are unit-tested; no hosted preview was created or inspected.

## Verification results

- Production build, including Next TypeScript checks: passed.
- Repository ESLint and `git diff --check`: passed.
- Seven automated routing test groups: passed. Cover exact/uppercase/port hosts, spoofed forwarded hosts, disallowed suffix matches, query preservation, local/preview restrictions, internal redirects, unknown-path 404, assets, Next Image, favicon, robots/sitemap, all seven existing legal pages, normal preview behavior and alternating-host content/metadata isolation.
- Actual Chromium browser: 375×812 mobile, 768×1024 tablet, 1440×1000 desktop. No horizontal overflow; one H1; image and local-font requests loaded; anchor destinations exist; no console/page errors. Below-fold images verified by scrolling into view.
- Relief keyboard activation and selected/explanatory state verified. Skip link becomes visible on Tab and moves focus to `main`. Reduced-motion emulation reports `scroll-behavior: auto` and zero-duration transitions.
- 200% CSS zoom reflow checked in Chromium; not a native browser toolbar zoom or physical-device test.
- Text contrast calculations: muted on background 8.94:1, primary on background 7.14:1, white on primary 7.50:1, muted on lavender/sage 7.74:1/7.58:1, primary on Relief background 6.51:1.
- Existing `https://www.behelit.dev` returned HTTP 200 in a read-only external link check.
- No mobile application runtime, store listing availability, live Evenstate domain, deployed preview/CDN, assistive-technology user session, or Lighthouse score is claimed as verified.

Browser captures are local review artifacts in `/tmp/evenstate-*.png`, not website assets.

## User-owned launch steps and remaining gaps

**Launch prerequisites:** review the website and approve applicable Evenstate privacy/terms content before public launch. No applicable approved Evenstate legal documents were found; other products' policies were intentionally not reused. Publication also needs the user's eventual deployment and domain/DNS configuration. No code/build/asset blocker remains from local checks.

When ready, the user should:

1. Publish the reviewed code using the existing project's normal deployment workflow.
2. In the **existing Behelit Vercel project**, open Settings → Domains and add `evenstate.behelit.dev` to production. Keep it serving this project rather than redirecting to the apex. Use the exact domain configuration instructions/target Vercel displays. [Vercel domain documentation](https://vercel.com/docs/domains/working-with-domains/add-a-domain).
3. If Namecheap is the authoritative DNS provider, open Domain List → Manage → Advanced DNS and add/update a CNAME with Host `evenstate` and Value set to the exact Vercel target. Resolve conflicting records for that same host only. Preserve apex/www, mail records, other products, and nameservers. If DNS is hosted elsewhere, make this record at that provider instead. [Namecheap CNAME documentation](https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/).
4. Wait for Vercel to show valid configuration and HTTPS; verify the live homepage, canonical/social image, 404, robots/sitemap, and both original Behelit hosts after propagation.

**Content gaps, not evidence of release status:** no verified App Store/Google Play URLs; the page honestly omits download actions. No approved launch screenshot set exists; authentic product artwork and explicitly illustrative HTML are used. Current-build screenshots and verified store URLs are optional future additions to this marketing page. Future pricing remains unconfirmed and is not advertised.
