"use client";

import { useTransition, useState } from "react";
import { changePassword } from "@/app/admin/actions";

export default function ChangePasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await changePassword(fd);
      } catch (err: any) {
        setError(err.message ?? "Erro ao alterar senha.");
      }
    });
  }

  const inputStyle = {
    background: "var(--mw-bg-elevated)",
    border: "1px solid var(--mw-border)",
    color: "var(--mw-text-primary)",
    fontFamily: "var(--mw-font)",
    borderRadius: "var(--mw-radius-sm)",
    padding: "12px 14px",
    width: "100%",
    fontSize: "15px",
    outline: "none",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--mw-bg-base)" }}
    >
      <div
        className="w-full max-w-sm rounded-mw-md p-8 space-y-6"
        style={{
          background: "var(--mw-bg-surface)",
          border: "1px solid var(--mw-border)",
        }}
      >
        <div className="text-center space-y-2">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-2xl"
            style={{ background: "rgba(1,207,181,0.12)" }}
          >
            🔑
          </div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--mw-text-primary)", fontFamily: "var(--mw-font)" }}
          >
            Crie sua senha
          </h1>
          <p className="text-sm" style={{ color: "var(--mw-text-muted)" }}>
            Por segurança, defina uma senha pessoal antes de continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: "var(--mw-text-muted)" }}
            >
              Nova senha
            </label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              style={inputStyle}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: "var(--mw-text-muted)" }}
            >
              Confirmar senha
            </label>
            <input
              name="confirm"
              type="password"
              required
              style={inputStyle}
              placeholder="Repita a senha"
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-mw font-bold text-sm transition-all disabled:opacity-60"
            style={{
              background: "var(--mw-teal)",
              color: "var(--mw-navy)",
              fontFamily: "var(--mw-font)",
            }}
          >
            {isPending ? "Salvando…" : "Definir senha e entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
