import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";
import Link from "next/link";

export default async function NewProjectPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--mw-text-muted)" }}>
          <Link href="/admin/projects" style={{ color: "var(--mw-teal)" }}>
            Projetos
          </Link>
          <span>/</span>
          <span>Novo</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--mw-text-primary)" }}>
          Novo Projeto
        </h1>
      </div>
      <ProjectForm categories={categories} />
    </div>
  );
}
