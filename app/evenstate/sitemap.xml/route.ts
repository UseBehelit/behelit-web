export const dynamic = "force-static";

export function GET() {
  const paths = ["/", "/privacy", "/terms", "/support"];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>https://evenstate.behelit.dev${path}</loc></url>`).join("")}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
