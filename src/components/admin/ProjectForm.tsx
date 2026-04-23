"use client";

import { useRef, useState, useTransition } from "react";
import { createProject, updateProject } from "@/app/admin/actions";
import Link from "next/link";
import { Sparkles, RefreshCw, Upload } from "lucide-react";

const AUTH_METHODS = [
  { value: "hub_token", label: "Hub Token (SSO)" },
  { value: "public", label: "Público (sem autenticação)" },
  { value: "none", label: "Nenhum" },
];

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  thumbnail: string;
  category: string;
  specialtyColor: string;
  authMethod: string;
  isActive: boolean;
  isFeatured: boolean;
  responsibleName: string;
  teamName: string;
}

interface ProjectFormProps {
  project?: Project;
  categories: Category[];
}

const inputStyle = {
  background: "var(--mw-bg-elevated)",
  border: "1px solid var(--mw-border)",
  color: "var(--mw-text-primary)",
  fontFamily: "var(--mw-font)",
  borderRadius: "var(--mw-radius-sm)",
  padding: "10px 14px",
  width: "100%",
  fontSize: "14px",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--mw-text-secondary)",
  marginBottom: "6px",
};

const sectionStyle = {
  borderTop: "1px solid var(--mw-border)",
  paddingTop: "20px",
  marginTop: "4px",
};


export function ProjectForm({ project, categories }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail ?? "");
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const action = project ? updateProject.bind(null, project.id) : createProject;
  const defaultCategory = categories[0];

  async function handleFileUpload(file: File) {
    setUploading(true);
    setUploadError("");
    setImgError(false);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload-thumbnail", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error ?? "Falha no upload.");
      } else {
        setThumbnailUrl(data.url);
        setImgLoading(true);
      }
    } catch {
      setUploadError("Erro de rede ao fazer upload.");
    } finally {
      setUploading(false);
    }
  }

  function handleGenerate() {
    const name = nameRef.current?.value ?? "";
    const description = descRef.current?.value ?? "";
    const category = categoryRef.current?.value ?? "";

    // The API route proxies Pollinations server-side and returns the image directly.
    // Adding a random cache-buster so repeated clicks regenerate.
    const params = new URLSearchParams({
      name,
      description,
      category,
      _t: String(Date.now()),
    });
    const proxyUrl = `${window.location.origin}/api/generate-thumbnail?${params}`;
    setThumbnailUrl(proxyUrl);
    setImgLoading(true);
    setImgError(false);
  }

  return (
    <form
      action={(fd) => startTransition(() => action(fd))}
      className="space-y-5 max-w-2xl"
    >
      {/* ── Identificação ────────────────────────────────────── */}
      <div>
        <label style={labelStyle}>Nome</label>
        <input
          ref={nameRef}
          name="name"
          required
          defaultValue={project?.name}
          style={inputStyle}
          placeholder="Nome do projeto"
        />
      </div>

      <div>
        <label style={labelStyle}>Descrição</label>
        <textarea
          ref={descRef}
          name="description"
          required
          defaultValue={project?.description}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="Breve descrição do projeto"
        />
      </div>

      {/* ── Responsável & Equipe ──────────────────────────────── */}
      <div style={sectionStyle}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--mw-text-muted)" }}>
          Responsável
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Nome do Responsável</label>
            <input
              name="responsibleName"
              defaultValue={project?.responsibleName}
              style={inputStyle}
              placeholder="Ex: Dr. João Silva"
            />
          </div>
          <div>
            <label style={labelStyle}>Nome da Equipe</label>
            <input
              name="teamName"
              defaultValue={project?.teamName}
              style={inputStyle}
              placeholder="Ex: Equipe de Clínica Médica"
            />
          </div>
        </div>
      </div>

      {/* ── Embed & Thumbnail ─────────────────────────────────── */}
      <div style={sectionStyle}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--mw-text-muted)" }}>
          Conteúdo
        </p>

        <div className="space-y-5">
          <div>
            <label style={labelStyle}>URL de Embed</label>
            <input
              name="embedUrl"
              type="url"
              required
              defaultValue={project?.embedUrl}
              style={inputStyle}
              placeholder="https://seu-projeto.vercel.app"
            />
          </div>

          {/* Thumbnail with AI generation */}
          <div>
            <label style={labelStyle}>Thumbnail</label>

            {/* Preview */}
            {thumbnailUrl && (
              <div
                className="relative w-full mb-3 rounded-mw overflow-hidden"
                style={{ height: 160, background: "var(--mw-bg-elevated)" }}
              >
                {imgLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10"
                    style={{ background: "var(--mw-bg-elevated)" }}>
                    <Sparkles
                      size={24}
                      className="animate-pulse"
                      style={{ color: "var(--mw-teal)" }}
                    />
                    <p className="text-xs" style={{ color: "var(--mw-text-muted)" }}>
                      Gerando imagem com IA… pode levar alguns segundos
                    </p>
                  </div>
                )}
                {imgError && !imgLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs" style={{ color: "var(--mw-text-muted)" }}>
                      Falha ao carregar. Tente gerar novamente.
                    </p>
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={thumbnailUrl}
                  src={thumbnailUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={{ opacity: imgLoading || imgError ? 0 : 1, transition: "opacity 0.4s" }}
                  onLoad={() => { setImgLoading(false); setImgError(false); }}
                  onError={() => { setImgLoading(false); setImgError(true); }}
                />
              </div>
            )}

            {/* Input + buttons */}
            <div className="flex gap-2">
              <input
                name="thumbnail"
                type="text"
                value={thumbnailUrl}
                onChange={(e) => {
                  setThumbnailUrl(e.target.value);
                  setImgError(false);
                  setUploadError("");
                }}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="https://images.unsplash.com/... ou faça upload"
              />

              {/* File upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Enviar arquivo de imagem"
                className="flex items-center gap-2 px-4 py-2 rounded-mw text-sm font-semibold flex-shrink-0 transition-all disabled:opacity-60"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--mw-border)",
                  color: "var(--mw-text-secondary)",
                  fontFamily: "var(--mw-font)",
                  whiteSpace: "nowrap",
                }}
              >
                {uploading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
                {uploading ? "Enviando…" : "Upload"}
              </button>

              {/* AI generate button */}
              <button
                type="button"
                onClick={handleGenerate}
                title="Gerar thumbnail com IA baseado na descrição"
                className="flex items-center gap-2 px-4 py-2 rounded-mw text-sm font-semibold flex-shrink-0 transition-all"
                style={{
                  background: "rgba(1,207,181,0.12)",
                  border: "1px solid rgba(1,207,181,0.3)",
                  color: "var(--mw-teal)",
                  fontFamily: "var(--mw-font)",
                  whiteSpace: "nowrap",
                }}
              >
                {imgLoading && !uploading ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Sparkles size={15} />
                )}
                Gerar com IA
              </button>
            </div>

            {uploadError && (
              <p className="text-xs mt-1.5" style={{ color: "#f87171" }}>{uploadError}</p>
            )}
            <p className="text-xs mt-1.5" style={{ color: "var(--mw-text-muted)" }}>
              Cole uma URL, envie um arquivo (JPG/PNG/WebP, até 5 MB) ou clique em &quot;Gerar com IA&quot;.
            </p>
          </div>
        </div>
      </div>

      {/* ── Categoria & Auth ──────────────────────────────────── */}
      <div style={sectionStyle}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--mw-text-muted)" }}>
          Classificação
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Categoria</label>
            <select
              ref={categoryRef}
              name="category"
              required
              defaultValue={project?.category ?? defaultCategory?.name}
              style={inputStyle}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Método de Auth</label>
            <select
              name="authMethod"
              defaultValue={project?.authMethod ?? "hub_token"}
              style={inputStyle}
            >
              {AUTH_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label style={labelStyle}>Cor da Especialidade</label>
          <div className="flex gap-2 flex-wrap items-center">
            {categories.map((c) => (
              <label key={c.id} className="cursor-pointer" title={`${c.name}: ${c.color}`}>
                <input
                  type="radio"
                  name="specialtyColor"
                  value={c.color}
                  defaultChecked={
                    project?.specialtyColor === c.color ||
                    (!project && c.id === defaultCategory?.id)
                  }
                  className="sr-only"
                />
                <div
                  className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                  style={{ background: c.color, borderColor: "transparent" }}
                />
              </label>
            ))}
            <input
              type="color"
              name="customColor"
              style={{ width: 32, height: 32, borderRadius: 16, cursor: "pointer", border: "none" }}
              title="Cor personalizada"
            />
          </div>
        </div>
      </div>

      {/* ── Flags ─────────────────────────────────────────────── */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="hidden" name="isActive" value="false" />
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked={project?.isActive ?? true}
            className="w-4 h-4 accent-teal-400"
          />
          <span className="text-sm font-medium" style={{ color: "var(--mw-text-secondary)" }}>
            Ativo
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="hidden" name="isFeatured" value="false" />
          <input
            type="checkbox"
            name="isFeatured"
            value="true"
            defaultChecked={project?.isFeatured ?? false}
            className="w-4 h-4 accent-teal-400"
          />
          <span className="text-sm font-medium" style={{ color: "var(--mw-text-secondary)" }}>
            Destaque
          </span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-mw text-sm font-bold transition-all disabled:opacity-60"
          style={{
            background: "var(--mw-teal)",
            color: "var(--mw-navy)",
            fontFamily: "var(--mw-font)",
          }}
        >
          {isPending ? "Salvando…" : project ? "Salvar Alterações" : "Criar Projeto"}
        </button>
        <Link
          href="/admin/projects"
          className="px-6 py-2.5 rounded-mw text-sm font-semibold transition-all"
          style={{ border: "1px solid var(--mw-border)", color: "var(--mw-text-secondary)" }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
