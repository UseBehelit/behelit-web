export const dynamic = "force-static";

export function GET() {
  const preview = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development";
  return new Response(preview
    ? "User-agent: *\nDisallow: /\n"
    : "User-agent: *\nAllow: /\nDisallow: /evenstate$\nDisallow: /evenstate/robots.txt\nDisallow: /evenstate/sitemap.xml\nSitemap: https://evenstate.behelit.dev/sitemap.xml\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
