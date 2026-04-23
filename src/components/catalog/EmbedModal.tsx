"use client";

import { useEffect, useState, useRef } from "react";
import { X, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import type { Project } from "@/types/project";

interface EmbedModalProps {
  project: Project | null;
  onClose: () => void;
}

export function EmbedModal({ project, onClose }: EmbedModalProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!project) {
      setEmbedUrl(null);
      setError(null);
      return;
    }

    async function buildEmbedUrl() {
      setLoading(true);
      setError(null);

      try {
        if (project!.authMethod === "hub_token") {
          const res = await fetch("/api/sso", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId: project!.id }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error ?? "Falha ao gerar token SSO");
          }

          const { token } = await res.json();
          const url = new URL(project!.embedUrl);
          url.searchParams.set("hub_token", token);
          url.searchParams.set(
            "hub_verify_url",
            `${window.location.origin}/api/sso/verify`
          );
          setEmbedUrl(url.toString());
        } else {
          setEmbedUrl(project!.embedUrl);
        }
      } catch (err: any) {
        setError(err.message ?? "Erro ao carregar projeto");
      } finally {
        setLoading(false);
      }
    }

    buildEmbedUrl();
  }, [project]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: "rgba(8,9,26,0.96)" }}
    >
      {/* Modal header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{
          background: "var(--mw-bg-surface)",
          borderBottom: "1px solid var(--mw-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: project.specialtyColor }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--mw-text-primary)" }}
          >
            {project.name}
          </span>
          <span
            className="text-xs font-medium hidden sm:block"
            style={{ color: "var(--mw-text-muted)" }}
          >
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {embedUrl && (
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-mw transition-all"
              style={{ color: "var(--mw-text-muted)" }}
              title="Abrir em nova aba"
            >
              <ExternalLink size={16} />
            </a>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-mw transition-all"
            style={{ color: "var(--mw-text-muted)" }}
            title="Fechar (Esc)"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Loader2
              size={40}
              className="animate-spin"
              style={{ color: "var(--mw-teal)" }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: "var(--mw-text-secondary)" }}
            >
              Gerando acesso seguro…
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
            <AlertCircle size={40} style={{ color: "#AC145A" }} />
            <div className="text-center">
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "var(--mw-text-primary)" }}
              >
                Não foi possível carregar o projeto
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--mw-text-muted)" }}
              >
                {error}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-mw"
              style={{
                background: "var(--mw-teal)",
                color: "var(--mw-navy)",
              }}
            >
              Fechar
            </button>
          </div>
        )}

        {embedUrl && !loading && !error && (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={project.name}
            className="w-full h-full border-none"
            allow="fullscreen; clipboard-read; clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
          />
        )}
      </div>
    </div>
  );
}
