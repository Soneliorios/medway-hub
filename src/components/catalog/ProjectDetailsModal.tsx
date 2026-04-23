"use client";

import { useEffect } from "react";
import { X, User, Users, Tag } from "lucide-react";
import { SpecialtyBadge } from "./SpecialtyBadge";

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  specialtyColor: string;
  responsibleName: string;
  teamName: string;
  thumbnail: string;
}

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [project, onClose]);

  if (!project) return null;

  const color = project.specialtyColor || "#01CFB5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,9,26,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-mw-md overflow-hidden"
        style={{
          background: "var(--mw-bg-surface)",
          border: "1px solid var(--mw-border)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color accent bar */}
        <div className="h-1 w-full" style={{ background: color }} />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="space-y-2 pr-8">
            <SpecialtyBadge category={project.category} color={color} />
            <h2
              className="text-xl font-black leading-tight"
              style={{ color: "var(--mw-text-primary)", fontFamily: "var(--mw-font)" }}
            >
              {project.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all"
            style={{
              background: "var(--mw-bg-elevated)",
              color: "var(--mw-text-muted)",
            }}
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <div className="px-6 pb-5">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--mw-text-secondary)" }}
          >
            {project.description}
          </p>
        </div>

        {/* Details */}
        {(project.responsibleName || project.teamName) && (
          <div
            className="mx-6 mb-6 rounded-mw p-4 space-y-3"
            style={{ background: "var(--mw-bg-elevated)", border: "1px solid var(--mw-border)" }}
          >
            {project.responsibleName && (
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}22` }}
                >
                  <User size={14} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--mw-text-muted)" }}>
                    Responsável
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--mw-text-primary)" }}
                  >
                    {project.responsibleName}
                  </p>
                </div>
              </div>
            )}

            {project.teamName && (
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}22` }}
                >
                  <Users size={14} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--mw-text-muted)" }}>
                    Equipe
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--mw-text-primary)" }}
                  >
                    {project.teamName}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}22` }}
              >
                <Tag size={14} style={{ color }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--mw-text-muted)" }}>
                  Categoria
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--mw-text-primary)" }}
                >
                  {project.category}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex justify-end px-6 pb-6"
          style={{ marginTop: project.responsibleName || project.teamName ? 0 : 8 }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-mw text-sm font-semibold transition-all"
            style={{
              border: "1px solid var(--mw-border)",
              color: "var(--mw-text-secondary)",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
