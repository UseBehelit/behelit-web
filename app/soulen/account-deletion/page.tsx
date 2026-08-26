export const metadata = {
  title: "Delete Your Account | Soulen",
  description:
    "How to delete your Soulen account and data — in the app, or by request if you no longer have it installed.",
};

const DELETED = [
  ["Account", "Sign-in identity, email address, display name"],
  [
    "Dream journal",
    "Dream entries, interpretations, moods, symbols, tags, journal metadata, and dream connections",
  ],
  ["Tarot", "Daily draws, redraws, three-card spreads, and reflections"],
  ["Insights", "Weekly and monthly subconscious reports"],
  [
    "Uploaded files",
    "Photos attached to dreams, voice recordings, and generated artwork",
  ],
  [
    "Wallet",
    "SPX balance, full transaction history, and the subscription record we hold",
  ],
  [
    "Notifications",
    "Device push tokens, reminder preferences, and delivery history",
  ],
  ["Usage", "Daily counters and allowance records"],
];

const RETAINED = [
  [
    "Purchase records at Apple and Google",
    "Held by the store under its own policy. We neither control nor can delete them.",
  ],
  [
    "Short-lived server logs",
    "Operational and security logs at our infrastructure provider, kept briefly and never used to reconstruct your journal.",
  ],
  [
    "Records required by law",
    "Only where we are legally obliged, and only for as long as required.",
  ],
];

export default function AccountDeletionPage() {
  return (
    <main className="min-h-screen bg-[#0e0e0e] text-[#e5e2e1]">
      <div className="mx-auto w-full max-w-4xl px-6 py-20 sm:px-10 md:py-28">
        <a
          href="/"
          className="mb-16 inline-block font-body text-[10px] font-light tracking-[0.25em] text-[#444748] transition-colors hover:text-[#e5e2e1]"
        >
          ← BACK TO BEHELIT
        </a>

        <header className="mb-20 border-b border-[#444748]/20 pb-12">
          <span className="mb-5 block font-label text-xs uppercase tracking-[0.4em] text-secondary">
            Soulen
          </span>

          <h1 className="mb-8 font-headline text-5xl font-bold uppercase tracking-tight text-on-surface md:text-7xl">
            Delete Your Account
          </h1>

          <div className="space-y-2 font-body text-sm leading-relaxed text-on-surface-variant">
            <p>
              You can delete your account and its data at any time — from inside
              the app, or by emailing us if you no longer have it installed.
            </p>
            <p>Last updated: August 27, 2026</p>
          </div>
        </header>

        <div className="space-y-16 font-body text-[15px] font-light leading-[1.9] text-on-surface-variant md:text-base">
          <Section number="01" title="In the app">
            <ol className="mt-4 space-y-3">
              {[
                "Open Soulen and sign in",
                "Go to Profile → Settings",
                "Choose Delete account",
                "Confirm when prompted",
              ].map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-label text-xs tracking-[0.2em] text-secondary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <p className="mt-6">
              Deletion runs immediately. It cannot be undone, and there is no
              grace period or archived copy.
            </p>
          </Section>

          <Section number="02" title="By request, without the app">
            <p>
              Email{" "}
              <a
                href="mailto:support@behelit.dev?subject=Account%20deletion%20request"
                className="text-secondary transition-opacity hover:opacity-70"
              >
                support@behelit.dev
              </a>{" "}
              from <span className="text-on-surface">the email address on the account</span>, with the
              subject <span className="text-on-surface">Account deletion request</span>.
            </p>

            <p className="mt-6">
              Sending from the account&apos;s own address is how we verify the
              request. If you signed in with Apple or Google, use the address
              that provider gave us — including a private relay address if you
              used Hide My Email.
            </p>

            <p className="mt-6">
              We action requests within 30 days, and usually far sooner. You will
              receive a confirmation once it is done.
            </p>
          </Section>

          <Section number="03" title="What gets deleted">
            <p>
              Everything below is removed permanently, with no recovery and no
              retained copy.
            </p>

            <dl className="mt-8 space-y-6">
              {DELETED.map(([term, detail]) => (
                <div key={term} className="border-l border-secondary pl-6">
                  <dt className="font-headline text-base font-semibold text-on-surface">
                    {term}
                  </dt>
                  <dd className="mt-1">{detail}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section number="04" title="Cancel your subscription first">
            <div className="border-l-2 border-secondary bg-[#1a1a1a] px-6 py-5">
              <p className="text-on-surface">
                Deleting your account does not cancel a paid subscription.
              </p>
              <p className="mt-4">
                Soulen Plus is billed by Google Play or the App Store, not by us,
                so we cannot cancel it on your behalf. If you delete your account
                without cancelling, the store will keep charging you.
              </p>
            </div>

            <dl className="mt-8 space-y-6">
              <div className="border-l border-[#444748]/40 pl-6">
                <dt className="font-headline text-base font-semibold text-on-surface">
                  Android
                </dt>
                <dd className="mt-1">
                  Google Play → Menu → Payments &amp; subscriptions →
                  Subscriptions
                </dd>
              </div>

              <div className="border-l border-[#444748]/40 pl-6">
                <dt className="font-headline text-base font-semibold text-on-surface">
                  iOS
                </dt>
                <dd className="mt-1">Settings → your name → Subscriptions</dd>
              </div>
            </dl>
          </Section>

          <Section number="05" title="What is not deleted, and why">
            <dl className="mt-4 space-y-6">
              {RETAINED.map(([term, detail]) => (
                <div key={term} className="border-l border-[#444748]/40 pl-6">
                  <dt className="font-headline text-base font-semibold text-on-surface">
                    {term}
                  </dt>
                  <dd className="mt-1">{detail}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section number="06" title="Removing data without closing your account">
            <p>
              You can delete individual dream entries inside the app while
              keeping your account. To request removal of a specific category of
              data without closing the account, email{" "}
              <a
                href="mailto:support@behelit.dev"
                className="text-secondary transition-opacity hover:opacity-70"
              >
                support@behelit.dev
              </a>{" "}
              and tell us what you want removed.
            </p>
          </Section>
        </div>

        <footer className="mt-24 border-t border-[#444748]/20 pt-12 font-body text-sm font-light leading-relaxed text-on-surface-variant">
          <p>
            Full detail on what we collect, how long we keep it, and your rights
            is in the{" "}
            <a
              href="/soulen/privacy"
              className="text-secondary transition-opacity hover:opacity-70"
            >
              Privacy Policy
            </a>
            . The same policy is readable in the app without signing in, under
            Settings → Legal.
          </p>

          <p className="mt-4">
            Questions:{" "}
            <a
              href="mailto:support@behelit.dev"
              className="text-secondary transition-opacity hover:opacity-70"
            >
              support@behelit.dev
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6 flex items-baseline gap-5">
        <span className="font-label text-xs tracking-[0.3em] text-secondary">
          {number}
        </span>

        <h2 className="font-headline text-2xl font-bold uppercase tracking-tight text-on-surface md:text-3xl">
          {title}
        </h2>
      </div>

      <div>{children}</div>
    </section>
  );
}
