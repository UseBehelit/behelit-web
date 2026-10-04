import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReliefChoices } from "@/components/evenstate/ReliefChoices";

const title = "Evenstate — Daily practices for mind and body";
const description = "Explore daily Brain and Body practices, guided pauses for difficult moments, and a routine you can follow at your own pace.";
const url = "https://evenstate.behelit.dev/";
const socialImage = { url: `${url}evenstate/assets/social.png`, width: 1200, height: 630, alt: "Evenstate — Make space for your mind and body, with pearlescent Brain and Body sculptures." };

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Evenstate", type: "website", locale: "en_US", images: [socialImage] },
  twitter: { card: "summary_large_image", title, description, images: [socialImage] },
};

function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden="true" className="ev-arrow">{down ? "↓" : "↗"}</span>;
}

function Brand() {
  return <a className="ev-brand" href="#main" aria-label="Evenstate — back to top"><Image src="/evenstate/assets/icon-64.png" alt="" width={36} height={36} /><span>Evenstate<span className="ev-brand-by">by Behelit</span></span></a>;
}

export default function EvenstatePage() {
  return (
    <>
      <a className="ev-skip" href="#main">Skip to content</a>
      <header className="ev-header ev-container">
        <Brand />
        <nav className="ev-nav" aria-label="Main navigation"><a href="#daily">Daily</a><a href="#relief">Relief</a><a href="#your-practice">Your practice</a></nav>
        <a className="ev-button ev-header-cta" href="#daily">Explore Evenstate <Arrow /></a>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="ev-hero ev-container" aria-labelledby="hero-heading">
          <div className="ev-hero-copy">
            <p className="ev-eyebrow"><span className="ev-dot" />Daily practice · Moment-to-moment support</p>
            <h1 id="hero-heading">Make space for your <span>mind and body.</span></h1>
            <p className="ev-lead">Build a daily rhythm with practices for your mind and body. When a moment feels difficult, find a guided place to begin.</p>
            <div className="ev-actions"><a className="ev-button" href="#daily">Explore Daily <Arrow /></a><a className="ev-text-link" href="#relief">Discover Relief <Arrow down /></a></div>
            <p className="ev-availability">Made for iOS and Android.<br />Store download links are not available here yet.</p>
          </div>
          <figure className="ev-hero-art">
            <div className="ev-hero-halo" aria-hidden="true" />
            <Image src="/evenstate/assets/hero-brain-body.webp" alt="Pearlescent sculptures of a brain and a seated figure, in soft sage and lavender." width={1254} height={1254} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 52vw, 640px" preload />
            <figcaption><span>Two sides of you.</span><span>One daily rhythm.</span></figcaption>
          </figure>
        </section>

        <div className="ev-intro-rule ev-container"><span>Room for everyday practice.</span><span>Support for the moments in between.</span><Arrow down /></div>

        <section id="daily" className="ev-section ev-container" aria-labelledby="daily-heading">
          <div className="ev-section-heading"><div><p className="ev-eyebrow">01 / Daily</p><h2 id="daily-heading">Two sides of<br />your daily rhythm.</h2></div><p>Evenstate brings Brain and Body practices into one daily routine, with available practices first and time-of-day filters to help you find your next step.</p></div>
          <div className="ev-daily-pair">
            <article className="ev-daily-panel ev-brain">
              <div className="ev-panel-top"><span>Brain</span><span className="ev-panel-symbol" aria-hidden="true">✳</span></div>
              <div className="ev-sculpture-matte"><Image src="/evenstate/assets/brain-sculpture.webp" alt="Ivory brain sculpture with soft lavender and sage highlights on a warm matte background." width={1024} height={1024} sizes="(max-width: 700px) 75vw, 330px" /></div>
              <div className="ev-panel-copy"><h3>A little room for your mind.</h3><p>Explore attention, grounding, reflection, and planning. Focus on one thing, name what you’re feeling, or write down a useful next step.</p><ul className="ev-practice-list"><li>Focused-attention meditation</li><li>Sensory grounding</li><li>Plan one next step</li><li>Practice a learning skill</li></ul></div>
            </article>
            <article className="ev-daily-panel ev-body">
              <div className="ev-panel-top"><span>Body</span><span className="ev-panel-symbol" aria-hidden="true">☼</span></div>
              <div className="ev-sculpture-matte"><Image src="/evenstate/assets/body-sculpture.webp" alt="Seated ivory figure with hands resting together, on a warm matte background." width={1024} height={1024} sizes="(max-width: 700px) 75vw, 330px" /></div>
              <div className="ev-panel-copy"><h3>A little care for your body.</h3><p>Make room for daylight, comfortable breathing, movement, and relaxation. Follow an in-app guide or take a practice away from the screen.</p><ul className="ev-practice-list"><li>Morning daylight</li><li>Comfortable paced breathing</li><li>Gentle joint mobility</li><li>Set up the sleep environment</li></ul></div>
            </article>
          </div>
          <p className="ev-catalog-note"><span className="ev-dot" />60 practices across Brain and Body, including Core and Optional activities.</p>
        </section>

        <section className="ev-how ev-section ev-container" aria-labelledby="how-heading">
          <div className="ev-how-copy"><p className="ev-eyebrow">A practice, not a race</p><h2 id="how-heading">A clear next step,<br />at your pace.</h2>
            <ol className="ev-steps">
              <li><div><h3>See what fits now.</h3><p>Browse today’s practices by availability and time of day. Begin with the core routine, then add optional practices and choose their days.</p><p className="ev-step-detail">Core practices stay in your routine. Changes to optional practices apply from the next routine day.</p></div></li>
              <li><div><h3>Choose a way to practice.</h3><p>Follow guided steps, write a reflection, work through a checklist, or try a creative exercise. Pause when you need to. When a suggested timer ends, choose whether to continue or finish.</p></div></li>
              <li><div><h3>See the practice you’ve put in.</h3><p>Brain and Body each reflect the required practices you’ve completed today. Revisit your practice history and build a streak by completing your daily routine.</p></div></li>
            </ol>
          </div>
          <figure className="ev-routine-figure">
            <div className="ev-routine-sheet">
              <div className="ev-example-heading"><span>Daily rhythm</span><span className="ev-example-label">Illustrative example</span></div>
              <p className="ev-sheet-title">A little practice.<br />Something to return to.</p>
              <div className="ev-example-totals"><div><span className="ev-completion-orb ev-orb-brain" aria-hidden="true" /><span>Brain<strong>2 / 4</strong><small>required practices</small></span></div><div><span className="ev-completion-orb ev-orb-body" aria-hidden="true" /><span>Body<strong>1 / 3</strong><small>required practices</small></span></div></div>
              <ul className="ev-example-records"><li><span className="ev-check" aria-hidden="true">✓</span><span>Name the emotion<small>Brain · Completed</small></span></li><li><span className="ev-check" aria-hidden="true">✓</span><span>Morning daylight<small>Body · Completed</small></span></li><li><span className="ev-open-circle" aria-hidden="true" /><span>Plan one next step<small>Brain · Still to practice</small></span></li></ul>
              <p className="ev-sheet-note">A shared streak follows completion of all required Brain and Body practices for the day.</p>
            </div>
            <figcaption>Color reflects completed practices, not a health score.<br />An illustration, not an app screenshot. Daily totals vary by plan.</figcaption>
          </figure>
        </section>

        <section id="relief" className="ev-relief" aria-labelledby="relief-heading">
          <div className="ev-container ev-section">
            <div className="ev-relief-top"><div><p className="ev-eyebrow">02 / Relief</p><h2 id="relief-heading">For the moment<br />you’re in.</h2></div><p>Feeling stressed, afraid, angry, or overwhelmed? Choose the description closest to your experience and find a suggested exercise. If you’re not sure, there’s a starting point for that too.</p></div>
            <ReliefChoices />
            <div className="ev-relief-story"><figure><Image src="/evenstate/assets/relief-dunes.webp" alt="Dune grass beside a quiet shoreline in soft daylight." width={1536} height={1024} sizes="(max-width: 700px) 100vw, 60vw" /><figcaption>A quieter place to begin.</figcaption></figure><div className="ev-relief-story-copy"><span className="ev-line-icon" aria-hidden="true">↝</span><h3>A guided exercise.<br />Room to pause.</h3><p>Try breathing, grounding, releasing tension, or finding one next step. Follow the guidance, pause when you need to, and choose whether to continue or finish.</p><p className="ev-relief-options">Relief includes voice, chime, and silent options, plus an optional check-in at the end.</p></div></div>
          </div>
        </section>

        <section id="your-practice" className="ev-practice ev-section ev-container" aria-labelledby="practice-heading">
          <div><p className="ev-eyebrow">03 / Your practice</p><h2 id="practice-heading">Your routine,<br />saved on your device.</h2><p className="ev-lead">Evenstate saves your routine, preferences, and practice history locally. You can use the app without creating an account.</p></div>
          <div className="ev-practice-details"><div><span className="ev-detail-number">01</span><div><h3>Make yourself comfortable.</h3><p>Adjust motion, haptics, and Relief audio to suit your preferences.</p></div></div><div><span className="ev-detail-number">02</span><div><h3>Know what you’re choosing.</h3><p>Practice pages include adaptations and references so you can understand what you’re choosing.</p></div></div><p className="ev-connection-note">External reference websites and support services require the relevant connection.</p></div>
        </section>

        <section className="ev-closing" aria-labelledby="closing-heading"><div className="ev-container"><span className="ev-closing-mark" aria-hidden="true">✳</span><p className="ev-eyebrow">Come back to yourself</p><h2 id="closing-heading">A little space.<br />A daily rhythm.</h2><p>Explore daily practices for mind and body, with guided pauses for the moments in between.</p><div className="ev-actions"><a className="ev-button" href="#daily">Explore the daily routine <Arrow /></a><a className="ev-text-link" href="https://www.behelit.dev">About Behelit <Arrow /></a></div></div></section>
      </main>

      <footer className="ev-footer ev-container"><div className="ev-footer-top"><Brand /><nav aria-label="Footer navigation"><Link href="/privacy" prefetch={false}>Privacy</Link><Link href="/terms" prefetch={false}>Terms</Link><Link href="/support" prefetch={false}>Support</Link><a href="https://www.behelit.dev">Behelit <Arrow /></a></nav></div><div className="ev-footer-bottom"><p>Evenstate is not a medical device and does not diagnose, treat, cure, or prevent any medical condition. Consult a qualified healthcare professional for medical advice, diagnosis, or treatment.</p><p>Evenstate by Behelit.</p></div></footer>
    </>
  );
}
