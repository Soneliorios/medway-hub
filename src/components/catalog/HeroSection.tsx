"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SpecialtyBadge } from "./SpecialtyBadge";
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react";
import type { Project } from "@/types/project";

interface HeroSectionProps {
  projects: Project[];
  onOpen: (project: Project) => void;
  onDetails: (project: Project) => void;
}

export function HeroSection({ projects, onOpen, onDetails }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (projects.length <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext, projects.length]);

  if (projects.length === 0) return null;

  const active = projects[activeIndex];

  return (
    <div className="relative w-full" style={{ height: "70vh", minHeight: 480 }}>
      {/* Background: blurred thumbnail */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          key={active.id}
          src={active.thumbnail}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ filter: "blur(4px) brightness(0.4) scale(1.05)", transform: "scale(1.05)" }}
          unoptimized
        />
      </div>

      {/* Hero gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, #08091A 0%, rgba(8,9,26,0.6) 40%, rgba(8,9,26,0.2) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col justify-end pb-16 px-8 lg:px-16"
        style={{ maxWidth: "55%" }}
      >
        <div className="space-y-4">
          <SpecialtyBadge
            category={active.category}
            color={active.specialtyColor || "#01CFB5"}
          />
          <h1
            className="font-black leading-tight text-balance"
            style={{
              color: "var(--mw-text-primary)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontFamily: "var(--mw-font)",
            }}
          >
            {active.name}
          </h1>
          <p
            className="text-sm lg:text-base leading-relaxed max-w-xl"
            style={{ color: "var(--mw-text-secondary)" }}
          >
            {active.description}
          </p>

          {/* CTA buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onOpen(active)}
              className="flex items-center gap-2 px-6 py-3 rounded-mw font-bold text-sm transition-all duration-200"
              style={{
                background: "var(--mw-teal)",
                color: "var(--mw-navy)",
                fontFamily: "var(--mw-font)",
                boxShadow: "var(--mw-glow-teal)",
              }}
            >
              <Play size={16} fill="currentColor" />
              Abrir Projeto
            </button>
            <button
              onClick={() => onDetails(active)}
              className="flex items-center gap-2 px-6 py-3 rounded-mw font-semibold text-sm transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1.5px solid rgba(255,255,255,0.2)",
                color: "var(--mw-text-primary)",
                fontFamily: "var(--mw-font)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Info size={16} />
              Ver detalhes
            </button>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {projects.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="transition-all duration-300"
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background:
                  i === activeIndex ? "var(--mw-teal)" : "rgba(255,255,255,0.3)",
              }}
              aria-label={`Projeto ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation arrows */}
      {projects.length > 1 && (
        <>
          <button
            onClick={() =>
              setActiveIndex((i) => (i - 1 + projects.length) % projects.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all"
            style={{
              background: "rgba(8,9,26,0.7)",
              border: "1px solid var(--mw-border)",
              backdropFilter: "blur(4px)",
            }}
            aria-label="Anterior"
          >
            <ChevronLeft size={20} color="var(--mw-teal)" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all"
            style={{
              background: "rgba(8,9,26,0.7)",
              border: "1px solid var(--mw-border)",
              backdropFilter: "blur(4px)",
            }}
            aria-label="Próximo"
          >
            <ChevronRight size={20} color="var(--mw-teal)" />
          </button>
        </>
      )}
    </div>
  );
}
