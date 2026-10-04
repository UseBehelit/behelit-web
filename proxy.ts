import { NextResponse, type NextRequest } from "next/server";

const productionHost = "evenstate.behelit.dev";
const sharedFiles = new Set(["/file.svg", "/globe.svg", "/next.svg", "/vercel.svg", "/window.svg"]);

export function proxy(request: NextRequest) {
  // Use the HTTP Host only. Untrusted x-forwarded-host must never select a site.
  const authority = (request.headers.get("host") ?? "").toLowerCase();
  const host = authority.replace(/:\d+$/, "");
  const path = request.nextUrl.pathname;
  const localAllowed = !process.env.VERCEL && process.env.VERCEL_ENV !== "production";
  const localHost = localAllowed && host === "evenstate.localhost";
  const isEvenstate = host === productionHost || localHost;
  const previewAllowed = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
  const preview = previewAllowed && path === "/" && request.nextUrl.searchParams.get("evenstate-preview") === "1";

  // Public artwork and framework/API requests are never product page rewrites.
  if (path === "/api" || path.startsWith("/api/") || path.startsWith("/_next/") || path.startsWith("/evenstate/assets/") || sharedFiles.has(path)) {
    return NextResponse.next();
  }

  // The internal namespace is not a second indexable copy, even on the product host.
  if (path === "/evenstate" || path.startsWith("/evenstate/")) {
    const target = new URL(`https://${productionHost}`);
    if (localHost) {
      target.protocol = "http:";
      target.host = authority;
    }
    target.pathname = path.slice("/evenstate".length) || "/";
    target.search = request.nextUrl.search;
    const response = NextResponse.redirect(target, 308);
    response.headers.set("X-Robots-Tag", "noindex");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  if (!isEvenstate && !preview) return NextResponse.next();

  const target = request.nextUrl.clone();
  if (path === "/favicon.ico" || path === "/icon.png") {
    target.pathname = "/evenstate/assets/icon-32.png";
  } else if (path === "/apple-icon.png") {
    target.pathname = "/evenstate/assets/icon-180.png";
  } else {
    // Unknown paths reach Evenstate's catch-all 404, never another site's pages.
    target.pathname = `/evenstate${path === "/" ? "" : path}`;
  }
  const response = NextResponse.rewrite(target);
  response.headers.append("Vary", "Host");
  if (localHost || preview || process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/|api/|evenstate/assets/).*)"],
};
