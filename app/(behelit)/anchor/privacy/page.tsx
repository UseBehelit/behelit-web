import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ANCHOR Privacy Policy | Behelit",
  description:
    "How ANCHOR keeps your thoughts, decisions, and preferences on your device. Privacy, deletion, device backups, and contact information.",
  alternates: { canonical: "https://www.behelit.dev/anchor/privacy" },
};

const sections = [
  ["local-storage", "What stays on your device"],
  ["audio", "Audio and permissions"],
  ["sharing", "Tracking, sharing, and AI"],
  ["retention", "Retention and deletion"],
  ["backups", "Device backups and security"],
  ["support", "Website visits and support"],
  ["rights", "Your privacy rights"],
  ["children", "Children’s privacy"],
  ["changes", "Changes and contact"],
] as const;

const linkStyle = "text-[#f59e0b] underline decoration-[#f59e0b]/40 underline-offset-4 hover:decoration-[#f59e0b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#38bdf8]";

export default function AnchorPrivacyPage() {
  return (
    <main className="min-h-dvh bg-[#08080a] text-[#e5e2e1]">
      <article className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10 md:py-20">
        <Link href="/" className={`inline-block py-3 text-sm ${linkStyle}`}>
          ← Behelit
        </Link>
        <header className="mt-10 border-b border-white/15 pb-10">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[#f59e0b]">ANCHOR · Privacy</p>
          <h1 className="font-headline text-5xl leading-tight tracking-tight sm:text-6xl">Your thoughts. Your device.</h1>
          <p className="mt-6 text-xl">Privacy Policy</p>
          <p className="mt-3 text-sm leading-relaxed text-[#b9b9c2]">
            Effective and last updated: <time dateTime="2026-09-15">September 15, 2026</time>
          </p>
        </header>

        <div className="space-y-12 pt-10 text-base leading-8 text-[#c8c8d0]">
          <section aria-label="Overview" className="space-y-5">
            <p>
              ANCHOR (displayed as Anchor on your device) is a local-first spatial
              decision app developed and published by Behelit (“we,” “us,” or
              “our”). This policy covers the iOS and Android app, this policy
              page, and privacy-related support communications.
            </p>
            <p>
              ANCHOR requires no account. Behelit does not receive your thoughts,
              decisions, or app preferences. The app has no advertising, third-party
              tracking, or external AI processing. Your device’s backup settings
              can create a separate copy of local app data, as explained below.
            </p>
            <p>Contact: <a href="mailto:support@behelit.dev" className={linkStyle}>support@behelit.dev</a>.</p>
          </section>

          <nav aria-label="Privacy policy sections" className="rounded-2xl border border-white/15 bg-white/[0.025] p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#e5e2e1]">In this policy</h2>
            <ol className="grid gap-x-6 sm:grid-cols-2">
              {sections.map(([id, title], index) => (
                <li key={id}><a href={`#${id}`} className={`block py-2 text-sm ${linkStyle}`}>{index + 1}. {title}</a></li>
              ))}
            </ol>
          </nav>

          <Section id="local-storage" title="1. What stays on your device">
            <p>
              ANCHOR stores its working data strictly in the app’s on-device
              storage, using local SQLite and MMKV databases. This includes:
            </p>
            <ul className="list-disc space-y-2 pl-6 marker:text-[#38bdf8]">
              <li>Thoughts, drafts, anchor titles, and micro-steps you write.</li>
              <li>Evaluation matrix coordinates, importance and effort ratings, and thought positions.</li>
              <li>Completion status, timestamps, archived items, and session progress.</li>
              <li>Language, theme, onboarding, sound, and haptic preferences.</li>
            </ul>
            <p>
              This information lets the app organize your thoughts, resume work,
              and remember your choices. ANCHOR does not upload it to Behelit or
              a third party and has no app-operated cloud sync or remote database.
              Local record identifiers distinguish your entries; they are not
              advertising identifiers. The app reads your device’s language
              preference to choose an initial language, which you can change.
            </p>
          </Section>

          <Section id="audio" title="2. Audio and permissions">
            <p>
              Bundled WAV sound effects provide short UI feedback, optionally
              accompanied by native haptics. They play from files included with
              the app. ANCHOR performs zero microphone recording and no background
              audio streaming or continuous background playback.
            </p>
            <p>
              ANCHOR does not access your microphone, camera, contacts, location,
              or personal photo and media libraries. You can turn sound and
              haptic feedback off in the app’s settings.
            </p>
          </Section>

          <Section id="sharing" title="3. Tracking, sharing, and AI">
            <p>
              The ANCHOR app has zero third-party tracking, no advertising or
              advertising identifiers, and no external AI data transmission.
              It does not send your text, audio, or decisions to OpenAI,
              ElevenLabs, or other AI services. Bundled creative assets do not
              transmit your data when used.
            </p>
            <p>
              We do not sell or rent your app data, share it for marketing,
              profile you across apps or websites, or use your thoughts to train
              AI models. No analytics or remote crash-reporting service is
              integrated into the app. Apple and Google may separately process
              store, download, device-backup, or diagnostic information under
              their own policies and your platform settings.
            </p>
          </Section>

          <Section id="retention" title="4. Retention and deletion">
            <p>
              Local data remains on your device until you remove it or clear the
              app’s stored data. Archiving or completing a thought can preserve
              it in your local history; it is not the same as erasing all data.
              Behelit holds no server copy of your workspace and cannot remotely
              retrieve, export, restore, or delete it for you.
            </p>
            <ul className="list-disc space-y-2 pl-6 marker:text-[#38bdf8]">
              <li><strong className="text-[#e5e2e1]">Android:</strong> open system Settings → Apps → Anchor → Storage (or Storage &amp; cache) → Clear storage / Clear data. Labels vary by device.</li>
              <li><strong className="text-[#e5e2e1]">iOS:</strong> open Settings → General → iPhone Storage → Anchor → Delete App. Offload App preserves documents and data, so it does not erase your workspace.</li>
            </ul>
            <p>
              Clearing data or deleting the app removes the current local
              workspace and preferences. There is no ANCHOR account to delete.
              Copies in existing device backups must be managed separately;
              restoring a backup may restore previously saved data.
            </p>
          </Section>

          <Section id="backups" title="5. Device backups and security">
            <p>
              Depending on your operating system, device manufacturer, and
              settings, app data may be included in a device backup, cloud
              backup, or transfer to another device. These are operating-system
              services, not ANCHOR cloud sync. Behelit does not operate these
              backups or receive their contents.
            </p>
            <p>
              Manage backup inclusion, retention, and deletion through your
              Apple, Google, device-manufacturer, or computer backup settings.
              Deleting local data does not necessarily remove older backups.
              If you require no off-device copies, review and disable applicable
              backups and remove existing copies before entering sensitive data.
            </p>
            <p>
              ANCHOR relies on the operating system’s app sandbox and device
              protections. It does not provide a separate app password or promise
              additional database encryption. Protect your device with a passcode,
              keep it updated, and consider who can access it and its backups.
              No storage method can guarantee absolute security.
            </p>
          </Section>

          <Section id="support" title="6. Website visits and support">
            <p>
              Opening this policy uses your browser and requires a website
              request. Our hosting provider may process technical request data
              such as your IP address, browser information, requested URL, and
              request time to deliver and secure the website. This page does
              not receive your ANCHOR workspace and adds no advertising or
              analytics scripts.
            </p>
            <p>
              If you email Behelit, we receive your email address and the message
              or attachments you choose to send. Please do not include private
              thoughts unless you want to share them for support. We use this
              correspondence to respond, resolve the request, and meet applicable
              legal obligations. Our email and hosting providers process these
              communications or requests to provide their services; processing
              may occur outside your country.
            </p>
            <p>
              We retain support correspondence only as long as needed to handle
              your request and any related legal obligations. You can ask us to
              delete it. We may disclose information we actually hold where
              required by law; we cannot disclose a local workspace we do not possess.
            </p>
          </Section>

          <Section id="rights" title="7. Your privacy rights">
            <p>
              You control local app data through the app and your device. For
              information Behelit receives through support, applicable law may
              give you rights to access, correction, deletion, restriction,
              objection, or portability, and to complain to your local data
              protection authority. Contact us to exercise those rights; we may
              need to verify that a request relates to you.
            </p>
            <p>
              Where EEA or UK data protection law applies, we process support
              correspondence to respond to your request and provide support
              (our legitimate interests), and where necessary to meet legal
              obligations. Technical website requests are processed to deliver
              and secure the page. We do not collect additional app data merely
              to identify you or fulfill a request, and cannot supply a server
              export of data that remains exclusively in your workspace and
              any backups you control.
            </p>
          </Section>

          <Section id="children" title="8. Children’s privacy">
            <p>
              ANCHOR is a general-purpose decision tool and is not directed at
              children under 13. We do not knowingly collect children’s personal
              information through the app. If a child has sent personal
              information to support, a parent or guardian can contact us to
              request its deletion.
            </p>
          </Section>

          <Section id="changes" title="9. Changes and contact">
            <p>
              We will update this page and its date when our practices change.
              If a future feature changes how app data is transmitted or used,
              we will explain that change in the app and request consent where
              required before enabling the relevant processing.
            </p>
            <address className="border-l-2 border-[#f59e0b] pl-5 not-italic">
              <strong className="text-[#e5e2e1]">Behelit — developer and publisher of ANCHOR</strong><br />
              Privacy and support: <a href="mailto:support@behelit.dev" className={linkStyle}>support@behelit.dev</a><br />
              Website: <a href="https://www.behelit.dev" className={linkStyle}>www.behelit.dev</a>
            </address>
          </Section>
        </div>
      </article>
    </main>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-8 space-y-5 border-t border-white/10 pt-8">
      <h2 id={`${id}-heading`} className="font-headline text-3xl leading-tight text-[#e5e2e1]">{title}</h2>
      {children}
    </section>
  );
}
