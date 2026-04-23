import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteCategory } from "../actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--mw-text-primary)" }}
          >
            Categorias
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--mw-text-muted)" }}>
            {categories.length} categorias cadastradas
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="px-5 py-2.5 rounded-mw text-sm font-bold transition-all"
          style={{
            background: "var(--mw-teal)",
            color: "var(--mw-navy)",
            fontFamily: "var(--mw-font)",
            boxShadow: "var(--mw-glow-teal)",
          }}
        >
          + Nova Categoria
        </Link>
      </div>

      <div
        className="rounded-mw-md overflow-hidden"
        style={{
          background: "var(--mw-bg-surface)",
          border: "1px solid var(--mw-border)",
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--mw-border)" }}>
              {["Categoria", "Cor", "Ordem", "Ações"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "var(--mw-text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                style={{ borderBottom: "1px solid var(--mw-border)" }}
              >
                {/* Name + color preview */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: cat.color }}
                    />
                    <span
                      className="font-semibold"
                      style={{ color: "var(--mw-text-primary)" }}
                    >
                      {cat.name}
                    </span>
                  </div>
                </td>

                {/* Color swatch + hex */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ background: cat.color }}
                    />
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--mw-text-muted)" }}
                    >
                      {cat.color}
                    </span>
                  </div>
                </td>

                {/* Display order */}
                <td className="px-4 py-3">
                  <span
                    className="text-sm"
                    style={{ color: "var(--mw-text-secondary)" }}
                  >
                    {cat.displayOrder}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/categories/${cat.id}`}
                      className="px-3 py-1 text-xs font-semibold rounded-mw transition-all"
                      style={{
                        border: "1px solid var(--mw-border)",
                        color: "var(--mw-text-secondary)",
                      }}
                    >
                      Editar
                    </Link>
                    <DeleteButton
                      action={deleteCategory.bind(null, cat.id)}
                      label="Deletar"
                      confirmMessage={`Deletar a categoria "${cat.name}"? Projetos vinculados não serão deletados, mas perderão a referência de categoria.`}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-sm"
                  style={{ color: "var(--mw-text-muted)" }}
                >
                  Nenhuma categoria cadastrada.{" "}
                  <Link
                    href="/admin/categories/new"
                    style={{ color: "var(--mw-teal)" }}
                  >
                    Criar a primeira
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs mt-4" style={{ color: "var(--mw-text-muted)" }}>
        A ordem de exibição define como as categorias aparecem no catálogo. Edite cada categoria para ajustar a ordem.
      </p>
    </div>
  );
}
