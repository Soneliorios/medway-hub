"use client";

import { useTransition, useState } from "react";
import { changePassword } from "@/app/admin/actions";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await changePassword(fd);
      } catch (err: any) {
        // Re-throw Next.js redirect — it must propagate to the framework
        if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
        setError(err.message ?? "Erro ao alterar senha.");
      }
    });
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--mw-bg-elevated)",
    border: "1px solid var(--mw-border)",
    color: "var(--mw-text-primary)",
    fontFamily: "var(--mw-font)",
    borderRadius: "var(--mw-radius-sm)",
    padding: "12px 42px 12px 14px",
    width: "100%",
    fontSize: "15px",
    outline: "none",
  };

  function PasswordField({
    name,
    placeholder,
    show,
    onToggle,
  }: {
    name: string;
    placeholder: string;
    show: boolean;
    onToggle: () => void;
  }) {
    return (
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          required
          minLength={8}
          style={inputStyle}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--mw-text-muted)" }}
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    );
  }

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
            <PasswordField
              name="newPassword"
              placeholder="Mínimo 8 caracteres"
              show={showNew}
              onToggle={() => setShowNew((v) => !v)}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-2 uppercase tracking-wider"
              style={{ color: "var(--mw-text-muted)" }}
            >
              Confirmar senha
            </label>
            <PasswordField
              name="confirm"
              placeholder="Repita a senha"
              show={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
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
