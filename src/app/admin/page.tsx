import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderKanban, Users, Activity, TrendingUp, Tag } from "lucide-react";

export default async function AdminDashboard() {
  const [totalProjects, activeProjects, totalUsers] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { isActive: true } }),
    prisma.user.count(),
  ]);

  const stats = [
    {
      label: "Total de Projetos",
      value: totalProjects,
      icon: FolderKanban,
      color: "#407EC9",
      href: "/admin/projects",
    },
    {
      label: "Projetos Ativos",
      value: activeProjects,
      icon: Activity,
      color: "#01CFB5",
      href: "/admin/projects",
    },
    {
      label: "Usuários",
      value: totalUsers,
      icon: Users,
      color: "#FFB81C",
      href: "/admin/users",
    },
    {
      label: "Em Destaque",
      value: await prisma.project.count({ where: { isFeatured: true } }),
      icon: TrendingUp,
      color: "#AC145A",
      href: "/admin/projects",
    },
    {
      label: "Categorias",
      value: await prisma.category.count(),
      icon: Tag,
      color: "#01CFB5",
      href: "/admin/categories",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--mw-text-primary)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--mw-text-muted)" }}>
          Visão geral da plataforma Medway Hub
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-mw-md p-5 transition-all duration-200 group"
            style={{
              background: "var(--mw-bg-surface)",
              border: "1px solid var(--mw-border)",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-mw flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
            </div>
            <p
              className="text-3xl font-black"
              style={{ color: "var(--mw-text-primary)" }}
            >
              {value}
            </p>
            <p
              className="text-xs font-medium mt-1"
              style={{ color: "var(--mw-text-muted)" }}
            >
              {label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-mw text-sm font-bold transition-all"
          style={{
            background: "var(--mw-teal)",
            color: "var(--mw-navy)",
            boxShadow: "var(--mw-glow-teal)",
          }}
        >
          + Novo Projeto
        </Link>
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-mw text-sm font-semibold transition-all"
          style={{
            border: "1.5px solid var(--mw-teal)",
            color: "var(--mw-teal)",
            background: "transparent",
          }}
        >
          + Novo Usuário
        </Link>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-mw text-sm font-semibold transition-all"
          style={{
            border: "1.5px solid var(--mw-border)",
            color: "var(--mw-text-secondary)",
            background: "transparent",
          }}
        >
          + Nova Categoria
        </Link>
      </div>
    </div>
  );
}
