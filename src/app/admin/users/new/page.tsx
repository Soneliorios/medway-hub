import { UserForm } from "@/components/admin/UserForm";
import Link from "next/link";

export default function NewUserPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--mw-text-muted)" }}>
          <Link href="/admin/users" style={{ color: "var(--mw-teal)" }}>
            Usuários
          </Link>
          <span>/</span>
          <span>Novo</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--mw-text-primary)" }}>
          Novo Usuário
        </h1>
      </div>
      <UserForm />
    </div>
  );
}
