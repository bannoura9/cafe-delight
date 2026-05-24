import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Run Clerk only on routes that actually need auth. This keeps Clerk's
 * dev-mode `x-robots-tag: noindex` header off our public pages (Clerk
 * adds it to every response it touches when running with dev keys, to
 * prevent staging environments from being indexed).
 *
 * Public pages (/, /menu, /menu/[id], /cart, /checkout, /order/[id],
 * /about, /faq, /legal/*) never go through Clerk and are freely
 * indexable by Google.
 */
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Only /admin is protected. /sign-in and /sign-up are public Clerk
  // pages — Clerk's own components handle the rendering.
  if (pathname.startsWith("/admin")) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  // Only invoke the proxy (and therefore Clerk) on auth-related paths.
  // Everything else bypasses the middleware entirely, so Clerk can't
  // attach a noindex header to public pages while running on dev keys.
  matcher: ["/admin/:path*", "/sign-in/:path*", "/sign-up/:path*"],
};
