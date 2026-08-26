export const metadata = {
  title: "Privacy Policy | Soulen",
  description:
    "Privacy Policy for Soulen, an AI-powered dream interpretation and self-reflection application.",
};

export default function PrivacyPage() {
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
            Legal
          </span>

          <h1 className="mb-8 font-headline text-5xl font-bold uppercase tracking-tight text-on-surface md:text-7xl">
            Privacy Policy
          </h1>

          <div className="space-y-2 font-body text-sm leading-relaxed text-on-surface-variant">
            <p>Effective date: August 3, 2026</p>
            <p>Last updated: August 26, 2026</p>
          </div>
        </header>

        <div className="space-y-16 font-body text-[15px] font-light leading-[1.9] text-on-surface-variant md:text-base">
          <section>
            <p>
              This Privacy Policy explains how Behelit ("Behelit," "we," "us,"
              or "our") collects, uses, shares, and protects information when
              you use Soulen, our AI-powered dream interpretation and
              self-reflection mobile application (the "App"), and related
              websites or services (together, the "Services").
            </p>

            <p className="mt-6">
              By creating an account or using the Services, you agree to this
              Privacy Policy. If you do not agree, do not use the Services.
            </p>

            <div className="mt-8 border-l border-secondary pl-6">
              <p>Contact: support@behelit.dev</p>
              <p>
                Website:{" "}
                <a
                  href="https://behelit.dev"
                  className="text-secondary transition-opacity hover:opacity-70"
                >
                  behelit.dev
                </a>
              </p>
            </div>
          </section>

          <PolicySection number="01" title="Who We Are">
            <p>
              Soulen is a product of Behelit. We operate the App and related
              Services described in this Policy.
            </p>
          </PolicySection>

          <PolicySection number="02" title="Information We Collect">
            <p>We collect information in the following categories.</p>

            <Subsection title="Account and authentication information">
              <BulletList
                items={[
                  "Account identifiers created when you sign in with Apple or Google",
                  "Display name and profile information you choose to provide",
                  "Avatar or profile image URL if provided by your sign-in provider or you",
                  "Authentication tokens and session information needed to keep you signed in",
                ]}
              />
              <p className="mt-4">
                We do not receive your Apple or Google password. Sign-in is
                handled by those providers.
              </p>
            </Subsection>

            <Subsection title="Dream and content data">
              <BulletList
                items={[
                  "Dream journal text and other content you submit",
                  "Feeling, mood, tag, archetype, and related metadata you choose to enter",
                  "Reference images you upload, where available",
                  "Voice recordings you submit for transcription, where available",
                  "AI-generated interpretations, titles, moods, symbols, and artwork associated with your dreams",
                  "Whether you save a dream to your archive or library and related archive activity",
                ]}
              />
            </Subsection>

            <Subsection title="Usage, wallet, and purchase information">
              <BulletList
                items={[
                  "SPX token balance and token transaction history, including signup grants, purchases, consumptions, refunds, and related ledger entries",
                  "Subscription status for Soulen Plus, including plan, status, period dates, and related billing identifiers",
                  "App Store or Google Play purchase events processed through our billing partners",
                  "Feature usage needed to operate metering, allowances, and premium access",
                ]}
              />
            </Subsection>

            <Subsection title="Technical and device information">
              <BulletList
                items={[
                  "Device type, operating system, app version, and similar diagnostics",
                  "Error and diagnostic logs generated when the App contacts our backend",
                  "Language and locale preferences",
                  "Basic network and request metadata needed to secure and operate the Services",
                ]}
              />
            </Subsection>

            <Subsection title="Support communications">
              <BulletList
                items={[
                  "Information you send us when you contact support or otherwise communicate with us",
                ]}
              />
            </Subsection>

            <Subsection title="Push notifications and preferences">
              <p>If you enable notifications, we collect and store:</p>

              <BulletList
                items={[
                  "A device push token issued for your installation of the App",
                  "Device platform, optional device name, app version, and last-active timestamps for that token",
                  "Your in-app notification preference settings",
                  "Your app language preference as used for notification copy",
                  "A server-side log of notifications we attempt to send, including notification type, title, body, delivery status, and minimal routing data",
                ]}
              />

              <p className="mt-4">
                We do not put the full text of your dreams in push notification
                messages. Notification bodies are short summaries or generic
                prompts. Opening a notification takes you into the App for full
                content.
              </p>

              <p className="mt-4">
                Local reminders scheduled on your device are handled by your
                operating system. We store your reminder preferences so the App
                can schedule or cancel them.
              </p>
            </Subsection>
          </PolicySection>

          <PolicySection number="03" title="How We Use Information">
            <p>We use information to:</p>

            <BulletList
              items={[
                "Create and manage your account",
                "Provide dream interpretation, artwork generation, transcription, archive, marketplace, and related features",
                "Meter SPX usage, manage wallets, and deliver purchased packs or subscription benefits",
                "Personalize language, display name, and in-app preferences",
                "Secure the Services, prevent fraud and abuse, and enforce our Terms of Service",
                "Diagnose bugs, improve reliability, and develop new features",
                "Comply with law and respond to lawful requests",
                "Communicate about the Services, account issues, and important product updates",
                "Deliver push notifications and local reminders according to your settings",
              ]}
            />

            <p className="mt-6">
              We use AI systems to generate interpretations and images from
              content you submit. Your dream content may be processed by our
              service providers for that purpose.
            </p>
          </PolicySection>

          <PolicySection number="04" title="Legal Bases">
            <p>
              Depending on your location, we process personal data under one or
              more of these bases:
            </p>

            <BulletList
              items={[
                "Performance of a contract to provide the Services you request",
                "Legitimate interests, including security, product improvement, fraud prevention, and service-related notifications",
                "Consent, where required, including optional marketing notifications and device notification permission",
                "Legal obligation, where we must retain or disclose information",
              ]}
            />
          </PolicySection>

          <PolicySection number="05" title="How We Share Information">
            <p>We do not sell your personal information.</p>

            <p className="mt-6">We share information only as needed with:</p>

            <BulletList
              items={[
                "Supabase and other cloud or backend providers that host authentication, databases, storage, and related infrastructure",
                "Expo push notification infrastructure, Apple Push Notification service, Firebase Cloud Messaging, and related notification delivery services",
                "OpenAI and other AI providers that process submitted content to generate interpretations, transcriptions, and images",
                "Apple, Google, RevenueCat, and other payment or subscription partners used to process purchases and subscriptions",
                "Infrastructure vendors we use to operate, secure, and improve the Services",
                "Professional advisors, auditors, or authorities when required by law or to protect rights and safety",
                "A successor entity if Behelit is involved in a merger, acquisition, financing, or sale of assets",
              ]}
            />

            <p className="mt-6">
              Service providers are authorized to process information only to
              perform services for us and are expected to protect it
              appropriately.
            </p>
          </PolicySection>

          <PolicySection number="06" title="AI Processing Notice">
            <p>
              Soulen is designed for reflection and symbolic self-understanding.
              AI outputs are interpretive and are not medical, psychological,
              legal, or fortune-telling advice.
            </p>

            <p className="mt-6">
              When you submit dream text, audio, or images, that content may be
              transmitted to AI providers to generate results. Do not submit
              content you are not comfortable sharing with our service
              providers. Avoid including sensitive personal data about yourself
              or others unless necessary.
            </p>
          </PolicySection>

          <PolicySection number="07" title="Data Retention">
            <p>
              We retain account and content data while your account is active
              and as needed to provide the Services.
            </p>

            <p className="mt-6">
              If you delete your account, we delete or de-identify associated
              account data, dream content, wallet and ledger records, push
              tokens, notification preferences, notification delivery logs, and
              related stored media, subject to:
            </p>

            <BulletList
              items={[
                "Legal retention requirements",
                "Backup and disaster-recovery cycles",
                "Records needed to resolve disputes, prevent abuse, or comply with financial and tax obligations",
              ]}
            />

            <p className="mt-6">
              Purchase records held by Apple, Google, or other payment platforms
              may continue to exist under those platforms' policies.
            </p>
          </PolicySection>

          <PolicySection number="08" title="Your Choices and Rights">
            <p>Depending on your location, you may have rights to:</p>

            <BulletList
              items={[
                "Access the personal information we hold about you",
                "Correct inaccurate information",
                "Delete your account and related personal information",
                "Export or receive a copy of certain information",
                "Object to or restrict certain processing",
                "Withdraw consent where processing is based on consent",
              ]}
            />

            <p className="mt-6">In the App, you can:</p>

            <BulletList
              items={[
                "Update your display name",
                "Turn push notifications and dream reminders on or off in Settings",
                "Sign out",
                "Delete your account from Settings, where available",
              ]}
            />

            <p className="mt-6">
              You can also control notifications at the operating-system level.
              To exercise privacy rights, contact us at support@behelit.dev. We
              may need to verify your identity before fulfilling a request.
            </p>
          </PolicySection>

          <PolicySection number="09" title="Children">
            <p>
              The Services are not directed to children under 13, or the minimum
              age required in your country. We do not knowingly collect personal
              information from children. If you believe a child has provided us
              information, contact us and we will take appropriate steps to
              delete it.
            </p>
          </PolicySection>

          <PolicySection number="10" title="Security">
            <p>
              We use administrative, technical, and organizational measures
              designed to protect information, including authenticated access
              controls and encrypted transit where supported by our providers.
              No method of transmission or storage is completely secure. You are
              responsible for protecting access to your device and sign-in
              methods.
            </p>
          </PolicySection>

          <PolicySection number="11" title="International Transfers">
            <p>
              We may process and store information in countries other than where
              you live, including through cloud and AI providers. Where
              required, we use appropriate safeguards for cross-border
              transfers.
            </p>
          </PolicySection>

          <PolicySection number="12" title="Third-Party Services">
            <p>
              The Services may rely on third-party platforms including Apple,
              Google, Expo push notification infrastructure, AI providers, and
              payment processors. Their privacy practices are governed by their
              own policies. We are not responsible for third-party practices
              outside our control.
            </p>
          </PolicySection>

          <PolicySection
            number="13"
            title="California and Similar U.S. State Disclosures"
          >
            <p>
              If you are a resident of California or another U.S. state with
              similar privacy laws, you may have rights to know, delete,
              correct, and opt out of certain data practices.
            </p>

            <p className="mt-6">
              We do not sell personal information and we do not share personal
              information for cross-context behavioral advertising in the App as
              described in this Policy.
            </p>

            <p className="mt-6">
              To exercise applicable rights, contact us at support@behelit.dev.
            </p>
          </PolicySection>

          <PolicySection
            number="14"
            title="European Economic Area, UK, and Similar Regions"
          >
            <p>
              If you are in the EEA, UK, or a similar jurisdiction, you may have
              applicable privacy rights, including rights described in Section
              08. You may also lodge a complaint with your local supervisory
              authority.
            </p>
          </PolicySection>

          <PolicySection number="15" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will post
              the updated version in the App or on this page with a revised
              "Last updated" date and, when required, provide additional notice.
              Continued use of the Services after an update means you accept the
              revised Policy.
            </p>
          </PolicySection>

          <PolicySection number="16" title="Contact">
            <p>
              If you have questions about this Privacy Policy or our data
              practices, contact us:
            </p>

            <div className="mt-6 border-l border-secondary pl-6">
              <p className="font-medium text-on-surface">Behelit</p>
              <p>Email: support@behelit.dev</p>
              <p>
                Website:{" "}
                <a
                  href="https://behelit.dev"
                  className="text-secondary transition-opacity hover:opacity-70"
                >
                  behelit.dev
                </a>
              </p>
            </div>
          </PolicySection>
        </div>

        <footer className="mt-24 border-t border-[#444748]/20 pt-10">
          <p className="font-body text-[10px] font-light tracking-[0.2em] text-[#444748]">
            © 2026 BEHELIT. INDEPENDENT SOFTWARE.
          </p>
        </footer>
      </div>
    </main>
  );
}

function PolicySection({
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

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10">
      <h3 className="mb-4 font-headline text-lg font-semibold text-on-surface">
        {title}
      </h3>

      <div>{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-4">
          <span className="mt-[0.8em] h-1 w-1 shrink-0 bg-secondary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
