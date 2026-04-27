"use client";

import { useTransition } from "react";
import { createUser, updateUser } from "@/app/admin/actions";
import Link from "next/link";
import { Mail } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserFormProps {
  user?: User;
}

const inputStyle = {
  background: "var(--mw-bg-elevated)",
  border: "1px solid var(--mw-border)",
  color: "var(--mw-text-primary)",
  fontFamily: "var(--mw-font)",
  borderRadius: "var(--mw-radius-sm)",
  padding: "10px 14px",
  width: "100%",
  fontSize: "14px",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--mw-text-secondary)" as const,
  marginBottom: "6px",
};

export function UserForm({ user }: UserFormProps) {
  const [isPending, startTransition] = useTransition();
  const action = user ? updateUser.bind(null, user.id) : createUser;
  const isNew = !user;

  return (
    <form
      action={(fd) => startTransition(() => action(fd))}
      className="space-y-5 max-w-xl"
    >
      <div>
        <label style={labelStyle}>Nome</label>
        <input
          name="name"
          required
          defaultValue={user?.name}
          style={inputStyle}
          placeholder="Nome completo"
        />
      </div>

      <div>
        <label style={labelStyle}>E-mail</label>
        <div className="relative">
          <input
            name="email"
            type="email"
            required
            defaultValue={user?.email}
            style={{ ...inputStyle, paddingLeft: 38 }}
            placeholder="nome@medway.com.br"
            pattern=".*@medway\.com\.br$"
            title="Use um e-mail @medway.com.br"
          />
          <Mail
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--mw-text-muted)" }}
          />
        </div>
        {isNew && (
          <p className="text-xs mt-1.5" style={{ color: "var(--mw-text-muted)" }}>
            Apenas e-mails @medway.com.br são aceitos.
          </p>
        )}
      </div>

      {/* Edição: permite trocar senha manualmente */}
      {!isNew && (
        <div>
          <label style={labelStyle}>Nova senha (deixe em branco para não alterar)</label>
          <input
            name="password"
            type="password"
            style={inputStyle}
            placeholder="••••••••"
          />
        </div>
      )}

      <div>
        <label style={labelStyle}>Perfil</label>
        <select
          name="role"
          defaultValue={user?.role ?? "viewer"}
          style={inputStyle}
        >
          <option value="viewer">Viewer — apenas visualizar</option>
          <option value="editor">Editor — gerenciar projetos</option>
          <option value="admin">Admin — acesso total</option>
        </select>
      </div>

      {/* Invite notice */}
      {isNew && (
        <div
          className="flex items-start gap-3 rounded-mw p-4 text-sm"
          style={{
            background: "rgba(1,207,181,0.08)",
            border: "1px solid rgba(1,207,181,0.2)",
          }}
        >
          <Mail size={16} style={{ color: "var(--mw-teal)", flexShrink: 0, marginTop: 2 }} />
          <p style={{ color: "var(--mw-text-secondary)" }}>
            Um e-mail com senha temporária será enviado automaticamente. O usuário deverá criar uma senha pessoal no primeiro acesso.
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-mw text-sm font-bold transition-all disabled:opacity-60"
          style={{
            background: "var(--mw-teal)",
            color: "var(--mw-navy)",
            fontFamily: "var(--mw-font)",
          }}
        >
          {isPending
            ? isNew ? "Enviando convite…" : "Salvando…"
            : isNew ? "Enviar convite" : "Salvar Alterações"}
        </button>
        <Link
          href="/admin/users"
          className="px-6 py-2.5 rounded-mw text-sm font-semibold"
          style={{ border: "1px solid var(--mw-border)", color: "var(--mw-text-secondary)" }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
