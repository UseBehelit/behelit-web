import type { ReactNode } from "react";

export const metadata = {
  title: "Privacy Policy | Bonfire",
  description:
    "Privacy Policy for Bonfire, a game logging, rating and review app by Behelit.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c] text-[#e5e1e4]">
      <div className="mx-auto w-full max-w-4xl px-6 py-20 sm:px-10 md:py-28">
        <a
          href="/"
          className="mb-16 inline-block font-body text-[10px] font-light tracking-[0.25em] text-[#756f73] transition-colors hover:text-[#e5e1e4]"
        >
          ← BACK TO BEHELIT
        </a>

        <header className="mb-20 border-b border-[#2a2a2c] pb-12">
          <span className="mb-5 block font-label text-xs uppercase tracking-[0.4em] text-[#ff5500]">
            Bonfire · Legal
          </span>

          <h1 className="mb-8 font-headline text-5xl font-bold uppercase tracking-tight text-[#e5e1e4] md:text-7xl">
            Privacy Policy
          </h1>

          <div className="space-y-2 font-body text-sm leading-relaxed text-[#a9a2a6]">
            <p>Effective date: September 6, 2026</p>
            <p>Last updated: September 6, 2026</p>
          </div>
        </header>

        <div className="space-y-16 font-body text-[15px] font-light leading-[1.9] text-[#a9a2a6] md:text-base">
          <section>
            <p>
              This policy explains what Bonfire collects, why, and what you can
              do about it. Bonfire is a game logging, rating and review app
              published by Behelit (&quot;Behelit,&quot; &quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;).
            </p>

            <p className="mt-6">
              It is written to describe what the app actually does rather than
              everything an app of this kind might conceivably do. Where a
              practice does not apply to Bonfire, we say so.
            </p>

            <div className="mt-8 border-l border-[#ff5500] pl-6">
              <p>Contact: support@behelit.dev</p>
              <p>
                Website:{" "}
                <a
                  href="https://behelit.dev"
                  className="text-[#ff5500] transition-opacity hover:opacity-70"
                >
                  behelit.dev
                </a>
              </p>
            </div>
          </section>

          <PolicySection number="01" title="The Short Version">
            <BulletList
              items={[
                "We collect the account you create, the things you write, and what you choose to put on your profile.",
                "Most of that is public by design — reviews, lists, comments and profiles are meant to be read.",
                "We do not sell your data, we run no advertising, and there is no advertising or analytics SDK in the app.",
                "We do not see your payment details. Apple handles payment; RevenueCat tells us only whether a subscription is active.",
                "You can delete your account from inside the app, and you can email us to have the underlying records erased.",
              ]}
            />
          </PolicySection>

          <PolicySection number="02" title="Information We Collect">
            <Subsection title="Your account">
              <p>
                When you register with an email address we store that address
                and a hashed password. Passwords are hashed by our
                authentication provider and are never visible to us in plain
                text.
              </p>
              <p className="mt-6">
                When you use Sign in with Apple or Sign in with Google we
                receive an identifier for your account and, on the first sign-in
                only, the name and email address you agree to share. If you use
                Apple&apos;s Hide My Email, we receive a relay address and never
                see your real one.
              </p>
            </Subsection>

            <Subsection title="Your profile">
              <BulletList
                items={[
                  "Username, display name and biography",
                  "A location, if you type one — this is free text you write yourself, not a reading from your device",
                  "A profile picture and banner you choose",
                  "Level, experience and the title, frame and banner you have earned or selected",
                  "Any social links you add, such as Twitch, Steam or YouTube handles",
                ]}
              />
            </Subsection>

            <Subsection title="What you create">
              <BulletList
                items={[
                  "Reviews: your rating, title and text, the platforms you played on, whether you marked spoilers, hours played and completion status",
                  "Library entries: which games you have logged and their status — playing, completed, backlog, wishlist or dropped",
                  "Lists you build, the games in them, and any notes you attach",
                  "Comments you post on reviews and lists",
                  "Upvotes and downvotes you cast",
                ]}
              />
            </Subsection>

            <Subsection title="Your connections and moderation actions">
              <BulletList
                items={[
                  "Who you follow and who follows you",
                  "Accounts you block — visible only to you, never to the person blocked",
                  "Reports you file — visible only to you and to us, never to the person reported",
                  "Notifications generated for you by other people's activity",
                ]}
              />
            </Subsection>

            <Subsection title="Subscriptions">
              <p>
                If you subscribe to Bonfire Pro, our payments provider
                RevenueCat receives your Bonfire account identifier and the
                purchase made through Apple, and tells our servers whether your
                subscription is active and when it lapses. We never receive or
                store your card number, and Apple does not share it with us.
              </p>
            </Subsection>

            <Subsection title="Kept on your device only">
              <p>
                Your recent search terms, your content preferences and your
                haptics setting are stored on your phone and are never sent to
                us. Clearing them in Settings removes them.
              </p>
            </Subsection>

            <Subsection title="What we do not collect">
              <BulletList
                items={[
                  "No advertising identifiers, and no advertising of any kind",
                  "No third-party analytics or tracking SDK",
                  "No precise or background location",
                  "No contacts, calendar or health data",
                  "No camera access — choosing a profile picture reads only the image you pick from your photo library",
                  "No cross-app or cross-site tracking, and no data sold or shared for anyone else's marketing",
                ]}
              />
            </Subsection>
          </PolicySection>

          <PolicySection number="03" title="What Is Public, and What Is Not">
            <p>
              Bonfire is a social app and most of it is public on purpose. This
              matters more than any other section here, so it is stated plainly.
            </p>

            <Subsection title="Readable by anyone, including people without an account">
              <BulletList
                items={[
                  "Your profile: username, display name, biography, location, picture, banner, level, title and social links",
                  "Your reviews and ratings, and the games in your library",
                  "Your public lists and the notes in them",
                  "Your comments",
                  "Who you follow and who follows you",
                ]}
              />
            </Subsection>

            <Subsection title="Private to you">
              <BulletList
                items={[
                  "Your email address, which is never shown on your profile or shared with other users",
                  "The individual upvotes and downvotes you cast — only the totals are public",
                  "Your block list",
                  "Reports you file, including the fact that you filed one",
                  "Lists you mark private",
                  "Your notifications",
                ]}
              />
            </Subsection>

            <p className="mt-8">
              These boundaries are enforced by row-level security rules in our
              database rather than only by the app, so a change to the app
              cannot accidentally expose something on this second list.
            </p>
          </PolicySection>

          <PolicySection number="04" title="How We Use Information">
            <BulletList
              items={[
                "To operate the app: sign you in, show your library and reviews, and build the feeds you read",
                "To connect you to other people you choose to follow",
                "To calculate experience, levels and achievements",
                "To provide and enforce Bonfire Pro entitlements",
                "To keep the community usable: acting on reports, applying blocks, and removing content that breaks our rules",
                "To respond when you contact support",
                "To meet legal obligations and to investigate abuse of the service",
              ]}
            />
            <p className="mt-8">
              We do not use your content to train machine learning models, and
              we do not profile you for advertising.
            </p>
          </PolicySection>

          <PolicySection number="05" title="Legal Bases (EEA and UK)">
            <BulletList
              items={[
                "Performance of a contract: creating your account, storing your library and reviews, and delivering Bonfire Pro",
                "Legitimate interests: keeping the service secure, preventing abuse, and moderating reported content",
                "Consent: access to your photo library when you choose a picture, which you can withdraw in your device settings",
                "Legal obligation: retaining records where the law requires it",
              ]}
            />
          </PolicySection>

          <PolicySection number="06" title="Who We Share It With">
            <p>
              We do not sell personal data and we do not share it for anyone
              else&apos;s marketing. We use a small number of processors to run
              the service:
            </p>

            <Subsection title="Supabase">
              <p>
                Our database, authentication and file storage. Your account and
                everything you write is stored there, in a project hosted in
                Frankfurt, Germany (eu-central-1).
              </p>
            </Subsection>

            <Subsection title="RevenueCat">
              <p>
                Subscription management. Receives your Bonfire account
                identifier and your subscription status. No payment details.
              </p>
            </Subsection>

            <Subsection title="Apple">
              <p>
                App distribution, in-app purchases and Sign in with Apple. Apple
                processes your payment and holds your payment details under
                their own privacy policy.
              </p>
            </Subsection>

            <Subsection title="Google">
              <p>
                Sign in with Google, if you choose it. Google confirms your
                identity to us under their own privacy policy.
              </p>
            </Subsection>

            <Subsection title="IGDB and Twitch">
              <p>
                Our game catalogue comes from IGDB, a Twitch service. When you
                search for a game, the text you type is sent to IGDB so it can
                answer. Game artwork is served directly from IGDB&apos;s
                servers, which means IGDB receives the network request that
                loads an image, including your IP address, as any image host
                would. We do not send IGDB your account, your library or
                anything you have written.
              </p>
            </Subsection>

            <p className="mt-8">
              We may also disclose information where we are legally required to,
              or where it is necessary to protect the rights and safety of
              people using Bonfire. If Behelit is ever acquired, account data
              may transfer as part of that transaction, and this policy will
              continue to apply until you are told otherwise.
            </p>
          </PolicySection>

          <PolicySection number="07" title="International Transfers">
            <p>
              Your data is stored in the European Union. If you use Bonfire from
              outside the EU, your information is transferred there. Our
              processors may process data in other countries under standard
              contractual clauses or an equivalent safeguard.
            </p>
          </PolicySection>

          <PolicySection number="08" title="Retention and Deletion">
            <p>
              We keep your account and content for as long as your account
              exists.
            </p>

            <Subsection title="Deleting your account in the app">
              <p>
                Settings › Delete Account immediately withdraws your profile,
                reviews, lists and comments from public view. They stop
                appearing anywhere in Bonfire, for anyone, including you.
              </p>
              <p className="mt-6">
                The underlying records are marked as deleted rather than erased
                at that moment. This is deliberate — it lets us reverse an
                accidental deletion and preserve the integrity of related
                records, such as the ratings your reviews contributed to a
                game&apos;s score.
              </p>
            </Subsection>

            <Subsection title="Having your data erased">
              <p>
                To have the underlying records permanently erased rather than
                withdrawn, email support@behelit.dev from the address on your
                account. We will erase your personal data within 30 days and
                confirm when it is done, except where we are legally required to
                retain something, in which case we will tell you what and why.
              </p>
              <p className="mt-6">
                Some information necessarily survives your account: reports you
                filed remain available to us as moderation records, and
                aggregate figures such as a game&apos;s average rating and
                number of reviews do not identify you and are not reversed.
              </p>
            </Subsection>
          </PolicySection>

          <PolicySection number="09" title="Your Rights">
            <p>
              Depending on where you live, you may have the right to access,
              correct, export, restrict or object to the processing of your
              personal data, and to have it erased.
            </p>
            <BulletList
              items={[
                "Access and correction: most of your data is editable directly in the app, on your profile and in Settings",
                "Export: email support@behelit.dev and we will send you a machine-readable copy",
                "Erasure: see the section above",
                "Objection and restriction: email us and tell us what you object to",
                "Complaint: you may complain to your local data protection authority",
              ]}
            />
            <p className="mt-8">
              We do not discriminate against anyone for exercising these rights.
              There is no paid tier of privacy and no feature is withheld for
              asking.
            </p>
          </PolicySection>

          <PolicySection number="10" title="Children">
            <p>
              Bonfire is not intended for children under 13, or under the
              minimum age required in your country, and we do not knowingly
              collect their information. If you believe a child has created an
              account, email support@behelit.dev and we will remove it.
            </p>
          </PolicySection>

          <PolicySection number="11" title="Security">
            <p>
              Data is encrypted in transit and at rest by our infrastructure
              provider. Access to every table in our database is denied by
              default and opened only by explicit rules, so private information
              is protected at the database itself rather than only by the app in
              front of it.
            </p>
            <p className="mt-6">
              No system is perfectly secure. If a breach affects your personal
              data, we will notify you and the relevant authority as the law
              requires.
            </p>
          </PolicySection>

          <PolicySection number="12" title="Changes to This Policy">
            <p>
              We will update this page when the app changes, and we will move
              the &quot;last updated&quot; date at the top. If a change
              materially affects how we handle your information, we will tell
              you in the app before it takes effect.
            </p>
          </PolicySection>

          <PolicySection number="13" title="Contact">
            <div className="border-l border-[#ff5500] pl-6">
              <p className="font-medium text-[#e5e1e4]">Behelit</p>
              <p>Email: support@behelit.dev</p>
              <p>
                Website:{" "}
                <a
                  href="https://behelit.dev"
                  className="text-[#ff5500] transition-opacity hover:opacity-70"
                >
                  behelit.dev
                </a>
              </p>
            </div>
          </PolicySection>

          <section className="border-t border-[#2a2a2c] pt-12">
            <p className="text-sm">
              Game metadata and artwork are provided by{" "}
              <a
                href="https://www.igdb.com"
                className="text-[#ff5500] transition-opacity hover:opacity-70"
              >
                IGDB
              </a>
              .
            </p>
          </section>
        </div>
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
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-6 flex items-baseline gap-5">
        <span className="font-label text-xs tracking-[0.3em] text-[#ff5500]">
          {number}
        </span>

        <h2 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#e5e1e4] md:text-3xl">
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
  children: ReactNode;
}) {
  return (
    <div className="mt-10">
      <h3 className="mb-4 font-headline text-lg font-semibold text-[#e5e1e4]">
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
          <span className="mt-[0.8em] h-1 w-1 shrink-0 bg-[#ff5500]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
