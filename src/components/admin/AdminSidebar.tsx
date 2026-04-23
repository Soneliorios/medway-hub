"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FolderKanban, Users, LogOut, Tag } from "lucide-react";
import { MedwayLogo } from "@/components/shared/MedwayLogo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projetos", icon: FolderKanban, exact: false },
  { href: "/admin/categories", label: "Categorias", icon: Tag, exact: false },
  { href: "/admin/users", label: "Usuários", icon: Users, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-60 flex flex-col"
      style={{
        background: "var(--mw-bg-surface)",
        borderRight: "1px solid var(--mw-border)",
        zIndex: 40,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid var(--mw-border)" }}
      >
        <MedwayLogo className="w-8 h-8 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--mw-text-primary)" }}>
            Medway Hub
          </p>
          <p className="text-xs" style={{ color: "var(--mw-text-muted)" }}>
            Admin
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-mw transition-all duration-150 relative"
              style={{
                background: active ? "rgba(1,207,181,0.1)" : "transparent",
                color: active ? "var(--mw-teal)" : "var(--mw-text-secondary)",
                fontWeight: active ? 600 : 400,
              }}
            >
              {active && (
                <div
                  className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                  style={{ background: "var(--mw-teal)" }}
                />
              )}
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer: back to hub + sign out */}
      <div
        className="px-3 py-4 space-y-1"
        style={{ borderTop: "1px solid var(--mw-border)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-mw transition-all duration-150 text-sm"
          style={{ color: "var(--mw-text-muted)" }}
        >
          ← Voltar ao Hub
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-mw transition-all duration-150 text-sm"
          style={{ color: "var(--mw-text-muted)" }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
