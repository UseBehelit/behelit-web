import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { evenstateContact, evenstateLegalDate, evenstateOrigin, type EvenstateDocumentContent } from "@/content/evenstate-legal";

export function documentMetadata(document: EvenstateDocumentContent): Metadata {
  const title = `${document.title} | Evenstate`;
  const url = `${evenstateOrigin}/${document.slug}`;
  const images = [{ url: `${evenstateOrigin}/evenstate/assets/social.png`, width: 1200, height: 630, alt: "Evenstate by Behelit" }];
  return {
    title, description: document.description, alternates: { canonical: url },
    openGraph: { title, description: document.description, url, siteName: "Evenstate", type: "website", images },
    twitter: { card: "summary_large_image", title, description: document.description, images },
  };
}

export function DocumentPage({ document }: { document: EvenstateDocumentContent }) {
  return <>
    <a className="ev-skip" href="#main">Skip to content</a>
    <header className="ev-header ev-container ev-document-header">
      <Link className="ev-brand" href="/" prefetch={false} aria-label="Evenstate home">
        <Image src="/evenstate/assets/icon-64.png" width={36} height={36} alt="" />
        <span>Evenstate<span className="ev-brand-by">by Behelit</span></span>
      </Link>
      <Link className="ev-text-link" href="/" prefetch={false}>Back to Evenstate <span aria-hidden="true">↗</span></Link>
    </header>
    <main id="main" tabIndex={-1} className="ev-document ev-container">
      <header className="ev-document-intro">
        <p className="ev-eyebrow">{document.slug === "support" ? "Here to help" : "Clear information, considered care"}</p>
        <h1>{document.title}</h1>
        {document.slug !== "support" && <p className="ev-document-date">Effective and last updated: <time dateTime="2026-10-04">{evenstateLegalDate}</time></p>}
        <p className="ev-lead">{document.introduction}</p>
        <a className="ev-text-link" href={`mailto:${evenstateContact}`}>{evenstateContact} <span aria-hidden="true">↗</span></a>
      </header>
      <div className="ev-document-grid">
        <nav className="ev-document-toc" aria-label="On this page">
          <p className="ev-eyebrow">On this page</p>
          <ol>{document.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title.replace(/^\d+\. /, "")}</a></li>)}</ol>
        </nav>
        <article className="ev-document-body" aria-label={document.title}>
          {document.sections.map(section => <section key={section.id} id={section.id} aria-labelledby={`heading-${section.id}`}>
            <h2 id={`heading-${section.id}`}>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </section>)}
          {document.slug === "privacy" && <aside className="ev-document-note" aria-label="Service privacy information">
            <h2>Platform and hosting information</h2>
            <ul>
              <li><a href="https://vercel.com/legal/privacy-notice">Vercel privacy notice</a></li>
              <li><a href="https://www.apple.com/legal/privacy/">Apple privacy policy</a></li>
              <li><a href="https://policies.google.com/privacy">Google privacy policy</a></li>
            </ul>
          </aside>}
          {document.slug === "support" && <aside className="ev-document-note"><p>Looking for emotional support in your country?</p><a className="ev-text-link" href="https://findahelpline.com/">Find A Helpline <span aria-hidden="true">↗</span></a></aside>}
        </article>
      </div>
    </main>
    <footer className="ev-footer ev-container">
      <div className="ev-footer-top"><p>Evenstate by Behelit.</p><nav aria-label="Legal and support">
        <Link href="/privacy" prefetch={false} aria-current={document.slug === "privacy" ? "page" : undefined}>Privacy</Link>
        <Link href="/terms" prefetch={false} aria-current={document.slug === "terms" ? "page" : undefined}>Terms</Link>
        <Link href="/support" prefetch={false} aria-current={document.slug === "support" ? "page" : undefined}>Support</Link>
        <a href="https://behelit.dev">Behelit</a>
      </nav></div>
    </footer>
  </>;
}
