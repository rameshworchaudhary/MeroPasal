import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * NOTE ON ADMIN PROTECTION STRATEGY:
 * Firebase Auth state is managed client-side via the Firebase JS SDK, so this
 * middleware cannot directly verify a Firebase session (no server-readable
 * session cookie is configured in this starter). Real protection of /admin
 * routes is enforced by:
 *   1. AdminGuard component (src/components/admin/AdminGuard.tsx) — redirects
 *      non-admin users away from /admin on the client immediately after auth
 *      state resolves.
 *   2. Firestore Security Rules (firestore.rules) — the actual source of
 *      truth; even if someone bypassed the UI, Firestore would reject writes
 *      from non-admin UIDs.
 *
 * This middleware adds baseline security headers and is structured so you can
 * upgrade to full server-side session verification later (e.g. via Firebase
 * Admin SDK + session cookies, or NextAuth) without restructuring routes.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Basic security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
