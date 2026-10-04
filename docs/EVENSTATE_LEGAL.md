# Evenstate legal and support pages

Published content prepared on 2026-10-04 at the user's request, against mobile commit fa1424b and web commit 83685fe. Operator: Behelit. The user explicitly corrected the contact address to **app@behelit.dev**, including existing products' policy/support pages.

Public URLs:
- https://evenstate.behelit.dev/privacy
- https://evenstate.behelit.dev/terms
- https://evenstate.behelit.dev/support
- https://evenstate.behelit.dev/privacy#deletion

Content lives in `content/evenstate-legal.ts`, rendered by the server component `components/evenstate/DocumentPage.tsx`. The existing host proxy handles these nested routes without changes. Each document has its own canonical and social metadata. Landing-page footer links and the product sitemap include all three pages. Existing product policies change only their incorrect email address.

The policy describes local MMKV records, optional local reminders, reflection deletion, OS-level deletion, device backup/transfer, external resources, Vercel website requests, and support correspondence. It does not promise encrypted databases, no platform backups, or no network processing by external services. There is no fake account-deletion form: the app has no accounts. The terms preserve mandatory consumer rights and do not invent a governing jurisdiction, liability amount, subscription, or regulated medical-device status.

Store setup: use /privacy as the privacy-policy URL and /support as the support URL. Complete Apple App Privacy and Google Data Safety / Health apps declarations based on the final shipped binary and service settings. Publishing these pages does not complete those console declarations or resolve the separate native-permission/signing release findings. The general-wellbeing disclaimer must also appear in Google Play's app description. Do not submit website terms as a custom Apple EULA without separately checking Apple's custom-license requirements; the standard store license can remain in use.

Verification: `npm run build`; run `npm start -- --hostname 0.0.0.0 --port 3107`, then `npm run test:evenstate`, `npm run lint`, and `npx tsc --noEmit`. Use `http://evenstate.localhost:3107/privacy` (also /terms and /support) for browser checks. The query preview switch only selects the homepage; local hostname routing supports all document links. Recheck these live URLs after the main-branch deployment.
