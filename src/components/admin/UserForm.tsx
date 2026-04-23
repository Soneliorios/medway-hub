"use client";

import { useTransition } from "react";
import { createUser, updateUser } from "@/app/admin/actions";
import Link from "next/link";

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
        <input
          name="email"
          type="email"
          required
          defaultValue={user?.email}
          style={inputStyle}
          placeholder="email@medway.com.br"
        />
      </div>

      <div>
        <label style={labelStyle}>
          Senha{user ? " (deixe em branco para não alterar)" : ""}
        </label>
        <input
          name="password"
          type="password"
          required={!user}
          style={inputStyle}
          placeholder={user ? "••••••••" : "Mínimo 6 caracteres"}
          minLength={user ? undefined : 6}
        />
      </div>

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
          {isPending ? "Salvando…" : user ? "Salvar Alterações" : "Criar Usuário"}
        </button>
        <Link
          href="/admin/users"
          className="px-6 py-2.5 rounded-mw text-sm font-semibold"
          style={{
            border: "1px solid var(--mw-border)",
            color: "var(--mw-text-secondary)",
          }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
