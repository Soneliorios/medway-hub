import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UserForm } from "@/components/admin/UserForm";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) notFound();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--mw-text-muted)" }}>
          <Link href="/admin/users" style={{ color: "var(--mw-teal)" }}>
            Usuários
          </Link>
          <span>/</span>
          <span>{user.name}</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--mw-text-primary)" }}>
          Editar Usuário
        </h1>
      </div>
      <UserForm user={user} />
    </div>
  );
}
