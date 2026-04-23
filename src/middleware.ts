export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Protect all routes except:
     * - /login (auth page)
     * - /api/auth/* (NextAuth endpoints)
     * - /api/sso/verify (public SSO token validation endpoint)
     * - /_next/* (static assets)
     * - /favicon.ico, /medway-logo.svg, etc.
     */
    "/((?!login|api/auth|api/sso/verify|_next/static|_next/image|favicon\\.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp).*)",
  ],
};
