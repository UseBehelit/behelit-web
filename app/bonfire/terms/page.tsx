import type { ReactNode } from "react";

export const metadata = {
  title: "Terms of Service | Bonfire",
  description:
    "Terms of Service for Bonfire, a game logging, rating and review app by Behelit.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <div className="space-y-2 font-body text-sm leading-relaxed text-[#a9a2a6]">
            <p>Effective date: September 6, 2026</p>
            <p>Last updated: September 6, 2026</p>
          </div>
        </header>

        <div className="space-y-16 font-body text-[15px] font-light leading-[1.9] text-[#a9a2a6] md:text-base">
          <section>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to
              and use of Bonfire, the game logging, rating and review
              application (the &quot;App&quot;), and related websites or
              services (together, the &quot;Services&quot;) provided by Behelit
              (&quot;Behelit,&quot; &quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;).
            </p>

            <p className="mt-6">
              By creating an account, accessing, or using the Services, you
              agree to these Terms and our{" "}
              <a
                href="/bonfire/privacy"
                className="text-[#ff5500] transition-opacity hover:opacity-70"
              >
                Privacy Policy
              </a>
              . If you do not agree, do not use the Services.
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

          <TermsSection number="01" title="The Services">
            <p>
              Bonfire lets you record the games you play, rate and review them,
              build and share lists, follow other players, and earn experience
              and cosmetic items as you use the app. Game titles, artwork and
              metadata are supplied by IGDB.
            </p>
          </TermsSection>

          <TermsSection number="02" title="Eligibility and Accounts">
            <p>
              You must be at least 13 years old, or the minimum age required in
              your country, to use the Services. You are responsible for your
              account credentials and for everything done through your account.
            </p>
            <p className="mt-6">
              Usernames are claimed on a first-come basis. We may reclaim a
              username that impersonates someone, infringes a trademark, or is
              chosen to abuse or mislead.
            </p>
          </TermsSection>

          <TermsSection number="03" title="License to Use the App">
            <p>
              We grant you a personal, non-exclusive, non-transferable,
              revocable licence to use the App on devices you own or control,
              for your own non-commercial use. You may not copy, modify, reverse
              engineer, resell or redistribute the App, or scrape the Services
              or use automated means to extract data from them.
            </p>
          </TermsSection>

          <TermsSection number="04" title="Your Content">
            <p>
              Your reviews, lists, comments, profile text and images remain
              yours. You keep ownership of everything you write.
            </p>
            <p className="mt-6">
              By posting to Bonfire you grant Behelit a worldwide,
              royalty-free, non-exclusive licence to host, store, reproduce and
              display that content for the purpose of operating and promoting
              the Services. This licence exists so that we can show your review
              to other people, which is the point of posting it. It ends when
              you delete the content, except for copies retained in backups for
              a limited period.
            </p>
            <p className="mt-6">
              You are responsible for what you post, and you confirm that you
              have the right to post it.
            </p>
          </TermsSection>

          <TermsSection number="05" title="Community Rules">
            <p>Do not post, and do not use Bonfire to distribute:</p>
            <BulletList
              items={[
                "Harassment, threats, or targeted abuse of another person",
                "Hate speech, or content attacking people on the basis of who they are",
                "Sexual content involving minors, or any sexually explicit material",
                "Spam, scams, or repetitive promotional content",
                "Content that infringes someone else's copyright or trademark",
                "Another person's private information",
                "Deliberate, unmarked spoilers presented in order to ruin a game for others",
                "Impersonation of another person, studio or publisher",
              ]}
            />
            <p className="mt-8">
              Reviews are opinions and we do not moderate opinions. A negative
              review of a game is not abuse; a negative review aimed at a person
              may be.
            </p>
          </TermsSection>

          <TermsSection number="06" title="Reporting, Blocking and Moderation">
            <p>
              Every review, list, comment and account can be reported from
              inside the app, and every account can be blocked. Blocking is
              mutual in effect: neither of you will see the other&apos;s
              reviews, lists or comments, and the person blocked is not told.
            </p>
            <p className="mt-6">
              Content reported by several different people is hidden
              automatically while we review it. Hidden content is not deleted,
              and it is restored if the reports do not hold up. We may also
              remove content, suspend an account, or close it, at our
              discretion, when these Terms are broken.
            </p>
            <p className="mt-6">
              If your content is removed or your account is suspended and you
              believe it was a mistake, email support@behelit.dev and we will
              look at it again.
            </p>
          </TermsSection>

          <TermsSection number="07" title="Bonfire Pro">
            <p>
              Bonfire Pro is an optional auto-renewing subscription. Logging
              games, rating them and writing reviews are free and are not
              limited by it.
            </p>

            <Subsection title="Billing">
              <BulletList
                items={[
                  "Payment is charged to your Apple Account at confirmation of purchase",
                  "The subscription renews automatically at the end of each period unless you cancel at least 24 hours before it ends",
                  "Your account is charged for renewal within 24 hours before the end of the current period",
                  "Prices are shown in the app in your local currency before you buy, and may differ between countries",
                  "If a free trial is offered, any unused portion is forfeited when you buy a subscription",
                ]}
              />
            </Subsection>

            <Subsection title="Managing and cancelling">
              <p>
                Manage or cancel your subscription in your Apple Account
                settings. Deleting the app does not cancel a subscription.
                Refunds are handled by Apple under their policies; we cannot
                issue them directly, though we will help where we can.
              </p>
            </Subsection>

            <Subsection title="Changes">
              <p>
                We may change what Bonfire Pro includes or what it costs. If a
                price rises, you will be told before it applies to you and your
                subscription will not renew at the new price without your
                agreement, as required by the App Store.
              </p>
            </Subsection>
          </TermsSection>

          <TermsSection number="08" title="Levels, Titles and Cosmetics">
            <p>
              Experience, levels, achievements, titles, frames and banners are
              features of the Services, not property. They have no monetary
              value, cannot be exchanged for money, and cannot be sold or
              transferred between accounts.
            </p>
            <p className="mt-6">
              Cosmetics unlocked by reaching a level are earned and are never
              sold. Bonfire Pro includes its own separate cosmetics; it does not
              unlock anything that is earned by playing.
            </p>
            <p className="mt-6">
              We may adjust the experience curve, rebalance how experience is
              awarded, or retire a cosmetic. We will not remove something you
              have already earned without telling you.
            </p>
          </TermsSection>

          <TermsSection number="09" title="Game Data">
            <p>
              Game titles, descriptions, cover art, screenshots, release dates
              and related metadata are provided by IGDB and remain the property
              of their respective owners. Bonfire is not affiliated with, and is
              not endorsed by, any game publisher or developer whose work
              appears in the catalogue.
            </p>
            <p className="mt-6">
              Ratings and reviews on Bonfire are the opinions of the people who
              wrote them and are not statements by Behelit about any game.
            </p>
          </TermsSection>

          <TermsSection number="10" title="Intellectual Property">
            <p>
              The App, its design, its code and the Bonfire name and marks
              belong to Behelit. Nothing in these Terms transfers any of that to
              you.
            </p>
            <p className="mt-6">
              If you believe something on Bonfire infringes your copyright,
              email support@behelit.dev with a description of the work, where it
              appears, and your contact details. We will investigate and remove
              infringing content.
            </p>
          </TermsSection>

          <TermsSection number="11" title="Privacy">
            <p>
              Our{" "}
              <a
                href="/bonfire/privacy"
                className="text-[#ff5500] transition-opacity hover:opacity-70"
              >
                Privacy Policy
              </a>{" "}
              explains what we collect and why. Most of what you post on Bonfire
              is public by design, including your profile, reviews, lists and
              comments.
            </p>
          </TermsSection>

          <TermsSection number="12" title="Account Deletion">
            <p>
              You can delete your account at any time from Settings › Delete
              Account. Your profile, reviews, lists and comments are withdrawn
              from public view immediately.
            </p>
            <p className="mt-6">
              To have the underlying records permanently erased rather than
              withdrawn, email support@behelit.dev from the address on your
              account. See the Privacy Policy for what survives deletion and
              why.
            </p>
          </TermsSection>

          <TermsSection number="13" title="Third-Party Services">
            <p>
              The Services depend on Apple, Supabase, RevenueCat, Google and
              IGDB. Their availability is not within our control, and their own
              terms apply to your use of them. Links to outside websites,
              including links you or others post, are not endorsements.
            </p>
          </TermsSection>

          <TermsSection number="14" title="Disclaimers">
            <p>
              The Services are provided &quot;as is&quot; and &quot;as
              available,&quot; without warranties of any kind, whether express
              or implied, to the fullest extent permitted by law. We do not
              warrant that the Services will be uninterrupted, error-free, or
              that game data supplied by third parties will be accurate or
              complete.
            </p>
          </TermsSection>

          <TermsSection number="15" title="Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Behelit is not liable for
              indirect, incidental, special, consequential or punitive damages,
              or for lost data, lost profits, or lost goodwill.
            </p>
            <p className="mt-6">
              Our total liability for any claim relating to the Services is
              limited to the greater of the amount you paid us in the twelve
              months before the claim, or fifty United States dollars.
            </p>
            <p className="mt-6">
              Some jurisdictions do not allow these limitations. In those
              places, the limitations apply only to the extent permitted, and
              nothing here removes rights you have as a consumer that cannot be
              waived.
            </p>
          </TermsSection>

          <TermsSection number="16" title="Indemnity">
            <p>
              You agree to indemnify and hold Behelit harmless from claims,
              damages and costs arising from your content, your use of the
              Services, or your breach of these Terms.
            </p>
          </TermsSection>

          <TermsSection number="17" title="Suspension and Termination">
            <p>
              We may suspend or terminate your access if you break these Terms,
              if required by law, or to protect the Services or the people using
              them. You may stop using the Services at any time by deleting your
              account. Sections that by their nature should survive termination
              will survive it.
            </p>
          </TermsSection>

          <TermsSection number="18" title="Changes to the Services or Terms">
            <p>
              We may change the Services and these Terms. When a change is
              material we will tell you in the app or by email before it takes
              effect. Continuing to use the Services after a change means you
              accept it.
            </p>
          </TermsSection>

          <TermsSection number="19" title="Apple-Required Terms">
            <BulletList
              items={[
                "These Terms are between you and Behelit, not Apple. Apple is not responsible for the App or its content.",
                "Apple has no obligation to provide maintenance or support for the App.",
                "If the App fails to conform to any applicable warranty, you may notify Apple, and Apple may refund the purchase price. Apple has no other warranty obligation.",
                "Apple is not responsible for product liability claims, consumer protection claims, or claims that the App infringes intellectual property rights.",
                "You confirm that you are not located in a country subject to a United States Government embargo, and that you are not on any United States Government list of prohibited or restricted parties.",
                "Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.",
              ]}
            />
          </TermsSection>

          <TermsSection number="20" title="Governing Law and Disputes">
            <p>
              These Terms are governed by the laws applicable to Behelit&apos;s
              principal place of business, without regard to conflict-of-law
              rules, except where mandatory consumer protections in your country
              of residence require otherwise.
            </p>
            <p className="mt-6">
              If a dispute arises, contact us first at support@behelit.dev so we
              can try to resolve it informally. If informal resolution fails,
              disputes will be resolved in the courts competent for
              Behelit&apos;s principal place of business, unless mandatory law
              gives you the right to bring claims in your local courts.
            </p>
          </TermsSection>

          <TermsSection number="21" title="Miscellaneous">
            <BulletList
              items={[
                "If any provision of these Terms is unenforceable, the remaining provisions remain in effect",
                "Our failure to enforce a provision is not a waiver",
                "You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of assets",
                "These Terms and the Privacy Policy are the entire agreement between you and Behelit regarding the Services",
              ]}
            />
          </TermsSection>

          <TermsSection number="22" title="Contact">
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
          </TermsSection>

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

function TermsSection({
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
