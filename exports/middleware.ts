/**
 * Medway Hub — Next.js Middleware for External Projects
 * -------------------------------------------------------
 * Use este middleware em projetos Next.js externos que são embedados no Hub.
 *
 * INSTALAÇÃO:
 *   1. Copie este arquivo para a raiz do seu projeto Next.js como `middleware.ts`
 *   2. Defina a variável de ambiente:
 *      HUB_BASE_URL=https://hub.medway.com.br
 *      SSO_SECRET=<mesmo secret configurado no Hub>
 *   3. Ajuste `config.matcher` conforme necessário
 *
 * FLUXO:
 *   - Lê hub_token da query string
 *   - Verifica a assinatura JWT localmente (sem chamada HTTP ao Hub)
 *   - Injeta dados do usuário como headers para as Server Components/Route Handlers
 *   - Redireciona para o Hub se o token estiver ausente ou inválido
 *
 * REQUISITO:
 *   npm install jose
 */

import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const HUB_BASE_URL =
  process.env.HUB_BASE_URL ?? "https://hub.medway.com.br";
const SSO_SECRET = process.env.SSO_SECRET ?? "";

function getSecret() {
  return new TextEncoder().encode(SSO_SECRET);
}

export async function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  const token = searchParams.get("hub_token");

  if (!token) {
    const loginUrl = new URL(
      `/login?callbackUrl=${encodeURIComponent(request.url)}`,
      HUB_BASE_URL
    );
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());

    // Inject user info into request headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-hub-user-id", payload.sub ?? "");
    requestHeaders.set("x-hub-user-email", (payload.email as string) ?? "");
    requestHeaders.set("x-hub-user-role", (payload.role as string) ?? "");
    requestHeaders.set("x-hub-project-id", (payload.projectId as string) ?? "");

    // Optionally clean the token from the URL (remove from query string)
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete("hub_token");

    return NextResponse.rewrite(cleanUrl, {
      request: { headers: requestHeaders },
    });
  } catch {
    // Token invalid or expired — redirect to Hub
    const loginUrl = new URL("/login", HUB_BASE_URL);
    return NextResponse.redirect(loginUrl);
  }
}

// Apply to all routes except static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.svg|.*\\.png|.*\\.jpg|api/).*)",
  ],
};
