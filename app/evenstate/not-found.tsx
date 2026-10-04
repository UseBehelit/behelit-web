import Link from "next/link";

export default function EvenstateNotFound() {
  return (
    <main className="ev-not-found">
      <p className="ev-eyebrow">EVENSTATE · 404</p>
      <h1>A little off the path.</h1>
      <p>This page doesn’t exist. There’s a place to begin back home.</p>
      <Link className="ev-button" href="/" prefetch={false}>Back to Evenstate <span aria-hidden="true">↗</span></Link>
    </main>
  );
}
