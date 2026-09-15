import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NOX Privacy Policy | Behelit",
  description: "NOX privacy: on-device sky calculations, optional location, weather requests, local storage, deletion, and backups.",
  alternates: { canonical: "https://www.behelit.dev/nox/privacy" },
};

const sections = [
  [
    "local-data",
    "1. Local storage and astronomical calculations",
    [
      "NOX is a local-first night-sky observation app developed and published by Behelit. No account is required. Sky positions, Moon phases, observing windows, and target recommendations are calculated on your device using the selected observing location and time.",
      "Your selected city or coordinates, location permission choice, time zone, theme, language, units, and onboarding status are stored locally in MMKV. Weather and downloaded content may also be cached locally. Search text, camera direction, and current target selection are used within the app; not all transient state is persisted. The current version does not use a SQLite database for user records and does not provide an app-operated cloud database or preference synchronization.",
      "Local-first does not mean entirely offline: the location-based requests described below can transmit coordinates and technical request information. Operating-system backups may also contain local app data."
    ]
  ],
  [
    "location",
    "2. Optional location and heading",
    [
      "You can select a city or enter coordinates without granting GPS access. If you choose device location, NOX requests foreground location permission to obtain your observing position. It does not request background location access or track your travel history. You can revoke permission in system Settings and select a place manually.",
      "Coordinates saved by NOX are rounded to three decimal places. When GPS is enabled, the app may pass these coordinates to the operating system’s reverse-geocoding service to obtain a city name and time zone. That service may contact Apple, Google, or a device-provider service and process the coordinates and network information under its own policies. Heading readings, when available, guide orientation in the Sky view and are not uploaded by NOX."
    ]
  ],
  [
    "network",
    "3. Weather, content, and update requests",
    [
      "Cloud forecasts are requested directly from MET Norway at api.met.no for the selected observing location, whether chosen manually or obtained through GPS. Latitude and longitude are rounded to two decimal places before transmission. The provider also receives your IP address, request time, and an application-identifying User-Agent; that identifier names NOX, not an individual user. MET Norway states that its access logs contain IP addresses and coordinates included in requests. This is service delivery, not anonymous or zero-data transmission.",
      "NOX can download a configured astronomy event feed and app configuration, and builds configured for over-the-air updates can contact an update service such as Expo. Those hosts receive normal network request information, including IP address and relevant app or runtime information. NOX does not attach your saved location, preferences, or search text to its event-feed or app-configuration requests. Bundled content and local calculations remain available without those downloads; fresh forecasts require connectivity.",
      "Network-service operators control their own logs and retention under their policies. Their processing may occur outside your country. To avoid live network requests, use NOX offline; a manually selected location alone does not disable forecast requests."
    ]
  ],
  [
    "tracking",
    "4. No analytics, advertising, profiling, or AI transmission",
    [
      "NOX integrates no analytics tracking, advertising SDK, advertising identifier collection, cross-app user profiling, or remote crash-reporting service. Behelit does not sell or rent your NOX data, share it for advertising, or transmit your inputs to external AI services. Local astronomical calculations are not external AI processing.",
      "The service requests in section 3, optional operating-system geocoding, support correspondence, and device backups are distinct from tracking. We do not describe the app as having zero third-party data transmission because those functions do transmit the information stated here. Apple and Google may separately process store, purchase, download, or diagnostic information under their policies and your platform settings."
    ]
  ],
  [
    "media",
    "5. Audio, media, and permissions",
    [
      "NOX performs zero microphone recording and no background audio streaming or background audio playback. The current version contains no bundled WAV feedback files; interactions use native haptic feedback where implemented. The audio module is configured with recording and background capabilities disabled.",
      "Moon and planet textures are bundled visual assets used for local rendering. NOX does not need camera, contacts, personal photo-library, or shared-media storage access. It does not upload your photos or recordings. Foreground location is the optional permission described above."
    ]
  ],
  [
    "deletion",
    "6. Retention, deletion, and backups",
    [
      "Preferences and the last selected observing location remain on your device until overwritten or local app data is removed. Caches may be refreshed or replaced. Clearing app data removes the current local records; Behelit does not hold a synchronized copy and cannot remotely restore or delete your local records.",
      "Android: open Settings → Apps → NOX → Storage (or Storage & cache) → Clear storage / Clear data. iOS: open Settings → General → iPhone Storage → NOX → Delete App. Device labels vary. Offloading an iOS app preserves its documents and data and is not equivalent to deleting it.",
      "Depending on your operating system and settings, local data may be included in cloud or computer backups or device transfers. These are operating-system services, not NOX cloud sync. Manage inclusion and deletion through Apple, Google, your device manufacturer, or your computer backup settings. Deleting current app data does not necessarily delete existing backups; restoring a backup may restore saved locations and preferences.",
      "NOX relies on the operating-system app sandbox and device protections. It does not offer a separate app password or promise additional database encryption. Use a device passcode and keep your operating system updated. No storage or transmission method can guarantee absolute security."
    ]
  ],
  [
    "support",
    "7. Website visits and support",
    [
      "Opening this policy or another external link uses your browser and makes a network request. Website hosting providers may process IP address, browser information, requested URL, and request time to deliver and secure the page. This policy page adds no analytics or advertising scripts and receives no NOX local workspace.",
      "If you email support@behelit.dev, Behelit receives your address and the message or attachments you choose to send. In-app support drafts may include the app version, operating system, and device platform; you can review the draft before sending. We use correspondence to respond and resolve issues, with email providers processing it to provide their service. Avoid including precise coordinates or other private information unless necessary for your request.",
      "We retain support correspondence only as long as needed to handle the request and related legal obligations. You can request deletion. We may disclose information we hold when legally required, but we cannot disclose local app records we do not possess."
    ]
  ],
  [
    "rights",
    "8. Privacy rights and children",
    [
      "You control local app records through the app and device settings. Depending on applicable law, you may have rights to access, correct, delete, restrict, object to, or obtain a portable copy of information Behelit holds, and to complain to a data-protection authority. Contact support@behelit.dev to exercise those rights. We may need to verify that a request relates to you. We cannot provide a server export of records held only on your device.",
      "Where EEA or UK data-protection law applies, support and website security processing relies on our legitimate interests in responding to requests and operating a secure service, and on legal obligations where applicable. Optional GPS access is controlled by your permission choice. This policy does not replace the independent policies of weather, operating-system, or backup providers.",
      "NOX is a general-audience astronomy tool, not a service directed at children under 13. We do not knowingly collect children’s personal information through support. A parent or guardian can contact us to request deletion if a child has supplied such information."
    ]
  ],
  [
    "contact",
    "9. Changes and contact",
    [
      "We will update this page and its date if our practices change. Material changes to data use will be explained in the app where appropriate, with consent requested where required.",
      "Behelit — developer and publisher of NOX. Privacy and support: support@behelit.dev. Website: https://www.behelit.dev."
    ]
  ]
] as const;

const linkStyle = "text-[#b8c7f4] underline underline-offset-4 decoration-[#93a5e0]/40 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4";
export default function NoxPrivacyPage() {
  return <main className="min-h-dvh bg-[#05070c] text-[#f4f5f8]">
    <article className="mx-auto max-w-3xl px-6 py-12 sm:px-10 md:py-20">
      <Link href="/" className={`inline-block py-3 text-sm ${linkStyle}`}>← Behelit</Link>
      <header className="mt-10 border-b border-white/15 pb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-[#b8c7f4]">NOX · Privacy</p>
        <h1 className="font-headline mt-5 text-5xl leading-tight sm:text-6xl">Your sky. Your choice.</h1>
        <p className="mt-6 text-xl">Privacy Policy</p>
        <p className="mt-3 text-sm text-[#a0a7bd]">Effective and last updated: <time dateTime="2026-09-15">September 15, 2026</time></p>
        <p className="mt-6 leading-8 text-[#c8cddc]">Sky calculations happen on your device. Optional location and live forecasts have specific data flows, explained below. No accounts, advertising, analytics tracking, or external AI processing.</p>
        <a href="mailto:support@behelit.dev" className={`mt-4 inline-block ${linkStyle}`}>support@behelit.dev</a>
      </header>
      <nav aria-label="Privacy policy sections" className="my-10 rounded-2xl border border-white/15 bg-[#131829] p-6">
        <h2 className="mb-3 text-sm uppercase tracking-wider">In this policy</h2>
        <ol className="grid gap-x-6 sm:grid-cols-2">{sections.map(([id, title]) => <li key={id}><a href={`#${id}`} className={`block py-2 text-sm ${linkStyle}`}>{title}</a></li>)}</ol>
      </nav>
      <div className="space-y-10">{sections.map(([id, title, paragraphs]) => <section key={id} id={id} aria-labelledby={`${id}-title`} className="scroll-mt-8 space-y-5 border-t border-white/15 pt-8">
        <h2 id={`${id}-title`} className="font-headline text-3xl leading-tight">{title}</h2>
        {paragraphs.map((paragraph, index) => <p key={index} className="leading-8 text-[#c8cddc]">{paragraph}</p>)}
      </section>)}</div>
      <aside aria-label="Service and backup references" className="mt-10 border-t border-white/15 pt-8 text-sm leading-7">
        <h2 className="mb-3">Service and backup information</h2>
        <ul className="space-y-2">
          <li><a className={linkStyle} href="https://api.met.no/doc/TermsOfService">MET Norway API terms and access-log disclosure</a></li>
          <li><a className={linkStyle} href="https://expo.dev/privacy">Expo privacy policy</a></li>
          <li><a className={linkStyle} href="https://support.apple.com/en-us/108770">Apple: what iCloud backs up</a></li>
        </ul>
      </aside>
    </article>
  </main>;
}
