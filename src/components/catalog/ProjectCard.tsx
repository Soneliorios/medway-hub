"use client";

import { useState } from "react";
import Image from "next/image";
import { SpecialtyBadge } from "./SpecialtyBadge";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const accentColor = project.specialtyColor || "#01CFB5";

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer"
      style={{
        width: 280,
        borderRadius: "var(--mw-radius-md)",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        boxShadow: hovered ? "var(--mw-shadow-hover)" : "var(--mw-shadow-card)",
        border: hovered
          ? "1px solid var(--mw-border-active)"
          : "1px solid var(--mw-border)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(project)}
    >
      {/* Thumbnail 16:9 */}
      <div style={{ paddingTop: "56.25%", position: "relative" }}>
        <Image
          src={project.thumbnail}
          alt={project.name}
          fill
          sizes="280px"
          className="object-cover"
          style={{ transition: "transform 0.3s ease" }}
          unoptimized
        />
        {/* Gradient overlay bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,9,26,0.95) 0%, rgba(8,9,26,0.3) 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3" style={{ zIndex: 2 }}>
        <h3
          className="text-sm font-bold leading-snug"
          style={{ color: "var(--mw-text-primary)" }}
        >
          {project.name}
        </h3>

        {/* Hover overlay content */}
        {hovered && (
          <div className="animate-fade-in-up mt-2">
            <p
              className="text-xs leading-relaxed mb-3"
              style={{
                color: "var(--mw-text-secondary)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.description}
            </p>
            <button
              className="w-full py-2 text-xs font-bold rounded-mw transition-all"
              style={{
                background: "var(--mw-teal)",
                color: "var(--mw-navy)",
                fontFamily: "var(--mw-font)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onOpen(project);
              }}
            >
              Abrir Projeto
            </button>
          </div>
        )}
      </div>

      {/* Left specialty color accent */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: 3, background: accentColor }}
      />
    </div>
  );
}
