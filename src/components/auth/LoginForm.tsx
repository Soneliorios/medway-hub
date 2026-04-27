"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === "TOO_MANY_ATTEMPTS") {
          setError("Muitas tentativas. Aguarde 1 minuto e tente novamente.");
        } else {
          setError("E-mail ou senha inválidos.");
        }
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          className="rounded-mw px-4 py-3 text-sm font-medium"
          style={{
            background: "rgba(172,20,90,0.12)",
            border: "1px solid rgba(172,20,90,0.4)",
            color: "#FF6B9D",
          }}
        >
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-semibold"
          style={{ color: "var(--mw-text-secondary)" }}
        >
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com.br"
          className="w-full rounded-mw px-4 py-3 text-sm outline-none transition-all duration-200"
          style={{
            background: "rgba(13,16,36,0.8)",
            border: "1px solid var(--mw-border)",
            color: "var(--mw-text-primary)",
            fontFamily: "var(--mw-font)",
          }}
          onFocus={(e) => {
            e.target.style.border = "1px solid var(--mw-border-active)";
            e.target.style.boxShadow = "var(--mw-glow-teal)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1px solid var(--mw-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-semibold"
          style={{ color: "var(--mw-text-secondary)" }}
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-mw px-4 py-3 text-sm outline-none transition-all duration-200"
          style={{
            background: "rgba(13,16,36,0.8)",
            border: "1px solid var(--mw-border)",
            color: "var(--mw-text-primary)",
            fontFamily: "var(--mw-font)",
          }}
          onFocus={(e) => {
            e.target.style.border = "1px solid var(--mw-border-active)";
            e.target.style.boxShadow = "var(--mw-glow-teal)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1px solid var(--mw-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-mw py-3 text-sm font-bold tracking-wide transition-all duration-200 disabled:opacity-60"
        style={{
          background: loading ? "rgba(1,207,181,0.6)" : "var(--mw-teal)",
          color: "var(--mw-navy)",
          fontFamily: "var(--mw-font)",
          boxShadow: loading ? "none" : "var(--mw-glow-teal)",
        }}
      >
        {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Entrando…
        </span>
      ) : "Entrar"}
      </button>
    </form>
  );
}
