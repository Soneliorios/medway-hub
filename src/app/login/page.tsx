import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { MedwayLogo } from "@/components/shared/MedwayLogo";

export const metadata = {
  title: "Login — Medway Hub",
};

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--mw-bg-base)" }}
    >
      {/* Card glassmorphism */}
      <div
        className="w-full max-w-sm rounded-mw-md p-8 shadow-mw-hover"
        style={{
          background: "var(--mw-glass-bg)",
          border: "1px solid var(--mw-glass-border)",
          backdropFilter: "var(--mw-blur)",
          WebkitBackdropFilter: "var(--mw-blur)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <MedwayLogo className="w-12 h-12" />
          <div className="text-center">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--mw-text-primary)" }}
            >
              Medway Hub
            </h1>
            <p
              className="text-sm mt-1 font-medium"
              style={{ color: "var(--mw-text-muted)" }}
            >
              Plataforma centralizada de projetos
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-8"
          style={{ background: "var(--mw-border)" }}
        />

        {/* Form */}
        <Suspense>
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--mw-text-muted)" }}
        >
          Acesso restrito a usuários autorizados
        </p>
      </div>
    </div>
  );
}
