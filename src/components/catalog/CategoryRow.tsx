"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types/project";

interface CategoryRowProps {
  label: string;
  projects: Project[];
  onOpen: (project: Project) => void;
}

export function CategoryRow({ label, projects, onOpen }: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Use the first project's stored color so the row accent reflects DB data
  const color = projects[0]?.specialtyColor ?? "#01CFB5";

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  if (projects.length === 0) return null;

  return (
    <section className="relative px-6 mb-10">
      {/* Row header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-1 h-6 rounded-full flex-shrink-0"
          style={{ background: color }}
        />
        <h2
          className="text-base font-bold"
          style={{ color: "var(--mw-text-primary)" }}
        >
          {label}
        </h2>
        <span
          className="text-xs font-medium"
          style={{ color: "var(--mw-text-muted)" }}
        >
          ({projects.length})
        </span>
      </div>

      {/* Scroll container wrapper */}
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
          style={{
            background: "rgba(8,9,26,0.9)",
            border: "1px solid var(--mw-border)",
          }}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} color="var(--mw-teal)" />
        </button>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-2"
        >
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={onOpen} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
          style={{
            background: "rgba(8,9,26,0.9)",
            border: "1px solid var(--mw-border)",
          }}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} color="var(--mw-teal)" />
        </button>
      </div>
    </section>
  );
}
