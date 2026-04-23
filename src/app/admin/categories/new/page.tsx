import { CategoryForm } from "@/components/admin/CategoryForm";
import Link from "next/link";

export default function NewCategoryPage() {
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
          <span>Nova</span>
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--mw-text-primary)" }}
        >
          Nova Categoria
        </h1>
      </div>
      <CategoryForm />
    </div>
  );
}
