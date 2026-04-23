import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteUser } from "../actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

const roleColors: Record<string, { bg: string; color: string }> = {
  admin: { bg: "rgba(1,207,181,0.12)", color: "#01CFB5" },
  editor: { bg: "rgba(64,126,201,0.12)", color: "#407EC9" },
  viewer: { bg: "rgba(153,166,189,0.12)", color: "#99A6BD" },
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--mw-text-primary)" }}>
            Usuários
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--mw-text-muted)" }}>
            {users.length} usuários cadastrados
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="px-5 py-2.5 rounded-mw text-sm font-bold transition-all"
          style={{
            background: "var(--mw-teal)",
            color: "var(--mw-navy)",
            fontFamily: "var(--mw-font)",
            boxShadow: "var(--mw-glow-teal)",
          }}
        >
          + Novo Usuário
        </Link>
      </div>

      <div
        className="rounded-mw-md overflow-hidden"
        style={{
          background: "var(--mw-bg-surface)",
          border: "1px solid var(--mw-border)",
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--mw-border)" }}>
              {["Nome", "E-mail", "Perfil", "Criado em", "Ações"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "var(--mw-text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const roleStyle = roleColors[user.role] ?? roleColors.viewer;
              return (
                <tr
                  key={user.id}
                  style={{ borderBottom: "1px solid var(--mw-border)" }}
                >
                  <td className="px-4 py-3 font-semibold" style={{ color: "var(--mw-text-primary)" }}>
                    {user.name}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--mw-text-secondary)" }}>
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2.5 py-0.5 rounded-mw-lg text-xs font-semibold"
                      style={{ background: roleStyle.bg, color: roleStyle.color }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--mw-text-muted)" }}>
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="px-3 py-1 text-xs font-semibold rounded-mw"
                        style={{
                          border: "1px solid var(--mw-border)",
                          color: "var(--mw-text-secondary)",
                        }}
                      >
                        Editar
                      </Link>
                      <DeleteButton
                        action={deleteUser.bind(null, user.id)}
                        label="Deletar"
                        confirmMessage={`Deletar "${user.name}"?`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
