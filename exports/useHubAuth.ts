/**
 * Medway Hub — useHubAuth React Hook
 * ------------------------------------
 * Use este hook em projetos React/Next.js externos que são embedados no Hub.
 *
 * INSTALAÇÃO:
 *   Copie este arquivo para o seu projeto.
 *
 * USO:
 *   import { useHubAuth } from './useHubAuth';
 *
 *   export default function MyProtectedPage() {
 *     const { user, status } = useHubAuth('https://hub.medway.com.br');
 *
 *     if (status === 'loading') return <div>Verificando acesso...</div>;
 *     if (status === 'unauthenticated') return null; // will redirect
 *
 *     return <div>Olá, {user.email}!</div>;
 *   }
 *
 * NEXT.JS MIDDLEWARE:
 *   Para proteger páginas inteiras no Next.js, use o middleware incluído
 *   em exports/middleware.ts.
 */

import { useState, useEffect } from "react";

export interface HubUser {
  id: string;
  email: string;
  role: string;
  projectId: string;
}

export type HubAuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface UseHubAuthResult {
  user: HubUser | null;
  status: HubAuthStatus;
  error: string | null;
}

/**
 * useHubAuth
 *
 * @param hubBaseUrl - Base URL of your Medway Hub deployment
 *                     e.g. "https://hub.medway.com.br"
 * @param options    - Optional configuration
 */
export function useHubAuth(
  hubBaseUrl: string,
  options: {
    /** If true, automatically redirects to Hub on auth failure. Default: true */
    autoRedirect?: boolean;
    /** Called when authentication succeeds */
    onSuccess?: (user: HubUser) => void;
    /** Called when authentication fails */
    onError?: (error: string) => void;
  } = {}
): UseHubAuthResult {
  const { autoRedirect = true, onSuccess, onError } = options;

  const [user, setUser] = useState<HubUser | null>(null);
  const [status, setStatus] = useState<HubAuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function authenticate() {
      // Read hub_token from URL
      const params = new URLSearchParams(window.location.search);
      const token = params.get("hub_token");

      if (!token) {
        const err = "Nenhum hub_token encontrado na URL";
        setError(err);
        setStatus("unauthenticated");
        if (onError) onError(err);
        if (autoRedirect) {
          window.location.href = `${hubBaseUrl}/login?callbackUrl=${encodeURIComponent(window.location.href)}`;
        }
        return;
      }

      try {
        const res = await fetch(`${hubBaseUrl}/api/sso/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok || !data.valid) {
          throw new Error(data.error ?? "Token inválido ou expirado");
        }

        const authenticatedUser: HubUser = data.user;

        // Clean token from URL without reload
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete("hub_token");
          window.history.replaceState({}, document.title, url.toString());
        } catch {
          // URL API not available in some environments
        }

        setUser(authenticatedUser);
        setStatus("authenticated");
        if (onSuccess) onSuccess(authenticatedUser);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro de autenticação";
        setError(message);
        setStatus("unauthenticated");
        if (onError) onError(message);
        if (autoRedirect) {
          window.location.href = `${hubBaseUrl}/login`;
        }
      }
    }

    authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubBaseUrl]);

  return { user, status, error };
}

/**
 * withHubAuth HOC — wraps a React component with Hub authentication.
 *
 * Usage:
 *   export default withHubAuth(MyPage, 'https://hub.medway.com.br');
 */
export function withHubAuth<P extends object>(
  Component: React.ComponentType<P & { hubUser: HubUser }>,
  hubBaseUrl: string
) {
  return function ProtectedComponent(props: P) {
    const { user, status } = useHubAuth(hubBaseUrl);

    if (status === "loading") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "Montserrat, sans-serif",
            background: "#08091A",
            color: "#01CFB5",
          }}
        >
          Verificando acesso…
        </div>
      );
    }

    if (status === "unauthenticated" || !user) {
      return null; // redirecting
    }

    return <Component {...props} hubUser={user} />;
  };
}
