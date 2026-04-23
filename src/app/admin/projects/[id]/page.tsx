import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);
  if (!project) notFound();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--mw-text-muted)" }}>
          <Link href="/admin/projects" style={{ color: "var(--mw-teal)" }}>
            Projetos
          </Link>
          <span>/</span>
          <span>{project.name}</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--mw-text-primary)" }}>
          Editar Projeto
        </h1>
      </div>
      <ProjectForm project={project} categories={categories} />
    </div>
  );
}
