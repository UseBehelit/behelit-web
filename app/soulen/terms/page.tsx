import type { ReactNode } from "react";

export const metadata = {
  title: "Terms of Service | Soulen",
  description:
    "Terms of Service for Soulen, an AI-powered dream interpretation and self-reflection application.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <div className="space-y-2 font-body text-sm leading-relaxed text-on-surface-variant">
            <p>Effective date: August 3, 2026</p>
            <p>Last updated: August 3, 2026</p>
          </div>
        </header>

        <div className="space-y-16 font-body text-[15px] font-light leading-[1.9] text-on-surface-variant md:text-base">
          <section>
            <p>
              These Terms of Service ("Terms") govern your access to and use of
              Soulen, the AI-powered dream interpretation and self-reflection
              mobile application (the "App"), and related websites or services
              (together, the "Services") provided by Behelit ("Behelit," "we,"
              "us," or "our").
            </p>

            <p className="mt-6">
              By creating an account, accessing, or using the Services, you
              agree to these Terms and our Privacy Policy. If you do not agree,
              do not use the Services.
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

          <TermsSection number="01" title="The Services">
            <p>
              Soulen helps users record dreams and receive AI-generated symbolic
              interpretations, artwork, archive tools, and related reflective
              experiences.
            </p>

            <p className="mt-6">
              Soulen does not provide medical, psychological, psychiatric,
              therapeutic, legal, financial, or fortune-telling advice. AI
              outputs are interpretive, probabilistic, and for personal
              reflection only. They are not a substitute for professional care
              or advice.
            </p>
          </TermsSection>

          <TermsSection number="02" title="Eligibility and Accounts">
            <p>
              You must be at least 13 years old, or the minimum age required in
              your country, to use the Services.
            </p>

            <p className="mt-6">
              You may need an account signed in with Apple or Google. You are
              responsible for:
            </p>

            <BulletList
              items={[
                "Maintaining the security of your device and sign-in methods",
                "Activity that occurs under your account",
                "Providing accurate information when requested",
              ]}
            />

            <p className="mt-6">
              We may suspend or terminate accounts that violate these Terms,
              appear fraudulent, or create risk to users, providers, or the
              Services.
            </p>
          </TermsSection>

          <TermsSection number="03" title="License to Use the App">
            <p>
              Subject to these Terms, we grant you a limited, non-exclusive,
              non-transferable, revocable license to install and use the App on
              devices you own or control for your personal, non-commercial use.
            </p>

            <p className="mt-6">You may not:</p>

            <BulletList
              items={[
                "Copy, modify, distribute, sell, lease, or reverse engineer the App except as allowed by law",
                "Bypass technical limits, paywalls, rate limits, or access controls",
                "Use the Services to build a competing product by scraping or systematically extracting content",
                "Interfere with or disrupt the Services",
                "Use the Services for unlawful, harmful, deceptive, or abusive purposes",
              ]}
            />
          </TermsSection>

          <TermsSection number="04" title="Your Content">
            <p>
              "User Content" means dream text, tags, feelings, images, audio,
              display name, and any other material you submit.
            </p>

            <p className="mt-6">
              You retain ownership of your User Content. By submitting User
              Content, you grant Behelit a worldwide, non-exclusive,
              royalty-free license to host, store, process, transmit, display,
              and create derivative works from that content solely as needed to
              operate, secure, improve, and provide the Services, including AI
              processing by our subprocessors.
            </p>

            <p className="mt-6">
              You represent that you have the rights needed to submit User
              Content and that your content does not violate law or third-party
              rights.
            </p>

            <p className="mt-6">Do not submit content that:</p>

            <BulletList
              items={[
                "Is illegal, threatening, harassing, exploitative, or hateful",
                "Infringes intellectual property or privacy rights",
                "Contains malware or attempts to compromise systems",
                "Seeks medical diagnosis or crisis intervention through the App",
                "Includes sensitive information about others without proper rights or consent",
              ]}
            />
          </TermsSection>

          <TermsSection number="05" title="AI Outputs">
            <p>
              The Services may generate titles, interpretations, moods, symbols,
              images, and related outputs ("AI Outputs").
            </p>

            <p className="mt-6">AI Outputs:</p>

            <BulletList
              items={[
                "May be incomplete, inaccurate, biased, or unsuitable",
                'Are provided "as is" for reflective and entertainment or self-discovery purposes',
                "Should not be relied on for health, safety, legal, or major life decisions",
              ]}
            />

            <p className="mt-6">
              You are responsible for how you interpret and use AI Outputs.
            </p>
          </TermsSection>

          <TermsSection
            number="06"
            title="SPX Tokens, Subscriptions, and Purchases"
          >
            <Subsection title="SPX">
              <p>
                SPX, also called subconscious credits or tokens, is a virtual
                currency used in the App to pay for certain AI generations and
                related features. SPX has no cash value outside the Services, is
                not redeemable for money, and is not a bank deposit, security,
                or stored-value instrument.
              </p>

              <p className="mt-6">Unless required by law or platform rules:</p>

              <BulletList
                items={[
                  "Purchased SPX is generally non-refundable once delivered",
                  "Unused SPX does not expire solely due to time, but remains usable only while your account and the Services remain available",
                  "SPX is tied to your account and is not transferable between users",
                ]}
              />
            </Subsection>

            <Subsection title="Generations and metering">
              <p>
                Dream interpretation and regeneration may consume SPX or use
                subscription allowances according to the pricing shown in the
                App. We may change generation costs, pack sizes, allowances, and
                feature gating.
              </p>

              <p className="mt-6">
                Failed generations that do not successfully complete should not
                consume SPX under our intended product rules, but temporary
                errors can occur. Contact support if you believe you were
                charged incorrectly.
              </p>
            </Subsection>

            <Subsection title="Soulen Plus">
              <p>
                Soulen Plus is a paid subscription that unlocks premium features
                and includes a generation allowance of up to 100 SPX per billing
                month, with a daily spend cap of 20 SPX per day. Allowances
                reset each billing cycle. Unused allowance does not roll over
                unless stated at purchase.
              </p>

              <p className="mt-6">
                Subscription terms, price, billing period, and renewal are
                presented at purchase and managed through your app store
                account.
              </p>
            </Subsection>

            <Subsection title="App Store billing">
              <p>
                Purchases and subscriptions are processed by Apple App Store,
                Google Play, and/or related billing partners such as RevenueCat.
                Their payment terms, taxes, refunds, and cancellation rules
                apply.
              </p>

              <p className="mt-6">
                To cancel a subscription, manage it in your Apple or Google
                account settings. Deleting the App or your Soulen account does
                not automatically cancel store subscriptions.
              </p>
            </Subsection>

            <Subsection title="Changes to pricing">
              <p>
                We may change prices, packs, allowances, and benefits
                prospectively. Changes to auto-renewing subscriptions will be
                handled according to applicable store rules and law.
              </p>
            </Subsection>
          </TermsSection>

          <TermsSection number="07" title="Intellectual Property">
            <p>
              The App, branding, design, software, and Behelit and Soulen
              materials are owned by Behelit or its licensors and are protected
              by intellectual property laws.
            </p>

            <p className="mt-6">
              Except for your User Content and rights granted by these Terms, no
              rights are transferred to you.
            </p>
          </TermsSection>

          <TermsSection number="08" title="Privacy">
            <p>
              Our collection and use of personal information is described in our
              Privacy Policy.
            </p>

            <p className="mt-6">
              <a
                href="/privacy"
                className="text-secondary transition-opacity hover:opacity-70"
              >
                View our Privacy Policy
              </a>
            </p>
          </TermsSection>

          <TermsSection number="09" title="Account Deletion">
            <p>
              You may request deletion of your account through the in-app delete
              account flow, where available, or by contacting us at
              support@behelit.dev.
            </p>

            <p className="mt-6">
              Deletion removes or de-identifies associated account data as
              described in the Privacy Policy, subject to legal and operational
              retention needs.
            </p>

            <p className="mt-6">
              Account deletion does not automatically cancel or refund App Store
              or Google Play subscriptions or restore consumed SPX.
            </p>
          </TermsSection>

          <TermsSection number="10" title="Third-Party Services">
            <p>
              The Services rely on third parties, including authentication
              providers, cloud infrastructure, AI providers, and payment
              platforms. We are not responsible for third-party outages, policy
              changes, or acts outside our reasonable control.
            </p>
          </TermsSection>

          <TermsSection number="11" title="Disclaimers">
            <p className="uppercase">
              The Services and AI Outputs are provided "as is" and "as
              available." To the maximum extent permitted by law, Behelit
              disclaims all warranties, express or implied, including
              merchantability, fitness for a particular purpose, title, and
              non-infringement.
            </p>

            <p className="mt-6">
              We do not warrant that the Services will be uninterrupted, secure,
              error-free, or that AI Outputs will meet your expectations.
            </p>
          </TermsSection>

          <TermsSection number="12" title="Limitation of Liability">
            <p className="uppercase">
              To the maximum extent permitted by law, Behelit and its
              affiliates, officers, employees, and partners will not be liable
              for indirect, incidental, special, consequential, exemplary, or
              punitive damages, or for lost profits, lost data, or loss of
              goodwill, arising from or related to the Services or these Terms.
            </p>

            <p className="mt-6 uppercase">
              To the maximum extent permitted by law, our total liability for
              any claim arising out of the Services or these Terms will not
              exceed the greater of: the amounts you paid to us for the Services
              in the 12 months before the claim, or USD $50.
            </p>

            <p className="mt-6">
              Some jurisdictions do not allow certain limitations. In those
              cases, the limits apply to the fullest extent permitted by law.
            </p>
          </TermsSection>

          <TermsSection number="13" title="Indemnity">
            <p>
              You agree to defend and indemnify Behelit against claims, damages,
              losses, and expenses, including reasonable attorneys' fees,
              arising from your User Content, your misuse of the Services, or
              your violation of these Terms or applicable law.
            </p>
          </TermsSection>

          <TermsSection number="14" title="Suspension and Termination">
            <p>
              We may suspend or terminate access to the Services at any time if
              we reasonably believe you violated these Terms, create risk, or if
              we discontinue the Services.
            </p>

            <p className="mt-6">
              You may stop using the Services at any time and may delete your
              account as described above.
            </p>

            <p className="mt-6">
              Sections that by nature should survive termination will survive,
              including ownership, disclaimers, limitations of liability, and
              indemnity.
            </p>
          </TermsSection>

          <TermsSection number="15" title="Changes to the Services or Terms">
            <p>
              We may modify the Services and these Terms. We will update the
              "Last updated" date in the App and may provide additional notice
              when required.
            </p>

            <p className="mt-6">
              Continued use after changes become effective constitutes
              acceptance of the revised Terms. If you do not agree, stop using
              the Services and delete your account.
            </p>
          </TermsSection>

          <TermsSection number="16" title="Apple-Required Terms">
            <p>
              If you download the App from the Apple App Store, you acknowledge
              that:
            </p>

            <BulletList
              items={[
                "These Terms are between you and Behelit, not Apple",
                "Apple has no obligation to provide maintenance or support for the App",
                "In the event of any failure of the App to conform to an applicable warranty, you may notify Apple, and Apple may refund the purchase price of the App, if any",
                "Apple is not responsible for addressing claims relating to the App or your possession or use of it",
                "Apple is not responsible for investigating, defending, settling, or discharging third-party intellectual property infringement claims",
                "Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you",
                "You represent that you are not located in a country subject to a U.S. government embargo and are not on any U.S. government prohibited or restricted party list",
              ]}
            />
          </TermsSection>

          <TermsSection number="17" title="Governing Law and Disputes">
            <p>
              These Terms are governed by the laws applicable to Behelit's
              principal place of business, without regard to conflict-of-law
              rules, except where mandatory consumer protections in your country
              of residence require otherwise.
            </p>

            <p className="mt-6">
              If a dispute arises, contact us first at support@behelit.dev so we
              can try to resolve it informally. If informal resolution fails,
              disputes will be resolved in the courts competent for Behelit's
              principal place of business, unless mandatory law gives you the
              right to bring claims in your local courts.
            </p>
          </TermsSection>

          <TermsSection number="18" title="Miscellaneous">
            <BulletList
              items={[
                "If any provision of these Terms is unenforceable, the remaining provisions remain in effect",
                "Our failure to enforce a provision is not a waiver",
                "You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of assets",
                "These Terms and the Privacy Policy are the entire agreement between you and Behelit regarding the Services",
              ]}
            />
          </TermsSection>

          <TermsSection number="19" title="Contact">
            <div className="border-l border-secondary pl-6">
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

            <p className="mt-6">
              Questions about these Terms can be sent using the contact details
              above.
            </p>
          </TermsSection>
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
  children: ReactNode;
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
