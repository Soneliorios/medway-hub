import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/CategoryForm";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) notFound();

  return (
    <div>
      <div className="mb-8">
        <div
          className="flex items-center gap-2 text-sm mb-4"
          style={{ color: "var(--mw-text-muted)" }}
        >
          <Link href="/admin/categories" style={{ color: "var(--mw-teal)" }}>
            Categorias
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--mw-text-primary)" }}
        >
          Editar Categoria
        </h1>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
