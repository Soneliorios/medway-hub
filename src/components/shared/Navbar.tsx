"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MedwayLogo } from "./MedwayLogo";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(8,9,26,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--mw-border)",
      }}
    >
      {/* Left: Logo + Title */}
      <Link href="/" className="flex items-center gap-3 group">
        <MedwayLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
        <span
          className="text-lg font-bold tracking-tight hidden sm:block"
          style={{ color: "var(--mw-text-primary)" }}
        >
          Medway{" "}
          <span style={{ color: "var(--mw-teal)" }}>Hub</span>
        </span>
      </Link>

      {/* Center: teal underline accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--mw-teal), transparent)",
        }}
      />

      {/* Right: user info + actions */}
      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            <span
              className="text-sm font-medium hidden md:block"
              style={{ color: "var(--mw-text-secondary)" }}
            >
              {session.user.name}
            </span>

            {(session.user as any).role === "admin" && (
              <Link
                href="/admin"
                className="text-xs font-semibold px-3 py-1.5 rounded-mw transition-all duration-200"
                style={{
                  background: "rgba(1,207,181,0.1)",
                  border: "1px solid var(--mw-border)",
                  color: "var(--mw-teal)",
                }}
              >
                Admin
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs font-semibold px-3 py-1.5 rounded-mw transition-all duration-200"
              style={{
                background: "transparent",
                border: "1px solid var(--mw-border)",
                color: "var(--mw-text-muted)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor =
                  "var(--mw-border-hover)";
                (e.target as HTMLElement).style.color = "var(--mw-text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "var(--mw-border)";
                (e.target as HTMLElement).style.color = "var(--mw-text-muted)";
              }}
            >
              Sair
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
