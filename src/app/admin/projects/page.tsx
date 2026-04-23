import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteProject, toggleProjectStatus } from "../actions";
import { SpecialtyBadge } from "@/components/catalog/SpecialtyBadge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import Image from "next/image";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--mw-text-primary)" }}
          >
            Projetos
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--mw-text-muted)" }}
          >
            {projects.length} projetos cadastrados
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-5 py-2.5 rounded-mw text-sm font-bold transition-all"
          style={{
            background: "var(--mw-teal)",
            color: "var(--mw-navy)",
            fontFamily: "var(--mw-font)",
            boxShadow: "var(--mw-glow-teal)",
          }}
        >
          + Novo Projeto
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
              {["Projeto", "Categoria", "Status", "Destaque", "Ações"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                    style={{ color: "var(--mw-text-muted)" }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                style={{ borderBottom: "1px solid var(--mw-border)" }}
              >
                {/* Thumbnail + name */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="relative flex-shrink-0 rounded"
                      style={{ width: 56, height: 32, overflow: "hidden" }}
                    >
                      <Image
                        src={project.thumbnail}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: "var(--mw-text-primary)" }}
                      >
                        {project.name}
                      </p>
                      <p
                        className="text-xs mt-0.5 max-w-xs truncate"
                        style={{ color: "var(--mw-text-muted)" }}
                      >
                        {project.embedUrl}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <SpecialtyBadge
                    category={project.category}
                    color={project.specialtyColor}
                  />
                </td>

                {/* Status toggle */}
                <td className="px-4 py-3">
                  <form>
                    <button
                      formAction={async () => {
                        "use server";
                        await toggleProjectStatus(project.id, !project.isActive);
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-mw-lg transition-all"
                      style={{
                        background: project.isActive
                          ? "rgba(1,207,181,0.12)"
                          : "rgba(99,99,99,0.12)",
                        color: project.isActive
                          ? "var(--mw-teal)"
                          : "var(--mw-text-muted)",
                      }}
                    >
                      {project.isActive ? "Ativo" : "Inativo"}
                    </button>
                  </form>
                </td>

                {/* Featured */}
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: project.isFeatured
                        ? "#FFB81C"
                        : "var(--mw-text-muted)",
                    }}
                  >
                    {project.isFeatured ? "★ Destaque" : "—"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="px-3 py-1 text-xs font-semibold rounded-mw transition-all"
                      style={{
                        border: "1px solid var(--mw-border)",
                        color: "var(--mw-text-secondary)",
                      }}
                    >
                      Editar
                    </Link>
                    <DeleteButton
                      action={deleteProject.bind(null, project.id)}
                      label="Deletar"
                      confirmMessage={`Deletar "${project.name}"? Esta ação não pode ser desfeita.`}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {projects.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm"
                  style={{ color: "var(--mw-text-muted)" }}
                >
                  Nenhum projeto cadastrado.{" "}
                  <Link
                    href="/admin/projects/new"
                    style={{ color: "var(--mw-teal)" }}
                  >
                    Criar o primeiro
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
