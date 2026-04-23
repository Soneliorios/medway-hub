"use client";

import { useState, useTransition } from "react";
import { createCategory, updateCategory } from "@/app/admin/actions";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  color: string;
  displayOrder: number;
}

interface CategoryFormProps {
  category?: Category;
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
} as const;

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--mw-text-secondary)",
  marginBottom: "6px",
} as const;

const PRESET_COLORS = [
  { label: "Clínica Médica", color: "#407EC9" },
  { label: "Cirurgia", color: "#00EFC8" },
  { label: "G.O.", color: "#AC145A" },
  { label: "Pediatria", color: "#FFB81C" },
  { label: "Preventiva", color: "#3B3FB6" },
  { label: "Teal", color: "#01CFB5" },
  { label: "Vermelho", color: "#E53E3E" },
  { label: "Verde", color: "#38A169" },
];

export function CategoryForm({ category }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedColor, setSelectedColor] = useState(
    category?.color ?? "#407EC9"
  );

  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;

  return (
    <form
      action={(fd) => {
        // Ensure the final selected color is submitted (color pickers can conflict)
        fd.set("color", selectedColor);
        startTransition(() => action(fd));
      }}
      className="space-y-5 max-w-lg"
    >
      <div>
        <label style={labelStyle}>Nome da Categoria</label>
        <input
          name="name"
          required
          defaultValue={category?.name}
          style={inputStyle}
          placeholder="Ex: Clínica Médica"
        />
      </div>

      <div>
        <label style={labelStyle}>Cor</label>

        {/* Color preview */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-mw flex-shrink-0"
            style={{ background: selectedColor }}
          />
          <span
            className="text-sm font-mono"
            style={{ color: "var(--mw-text-secondary)" }}
          >
            {selectedColor}
          </span>
        </div>

        {/* Preset swatches */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {PRESET_COLORS.map((p) => {
            const active = selectedColor === p.color;
            return (
              <button
                key={p.color}
                type="button"
                title={p.label}
                onClick={() => setSelectedColor(p.color)}
                className="w-8 h-8 rounded-full transition-all hover:scale-110"
                style={{
                  background: p.color,
                  outline: active ? `3px solid white` : "none",
                  outlineOffset: active ? "2px" : "0",
                  boxShadow: active ? `0 0 0 1px ${p.color}` : "none",
                }}
              />
            );
          })}
        </div>

        {/* Custom color picker */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              cursor: "pointer",
              border: "1px solid var(--mw-border)",
              background: "none",
              padding: 2,
            }}
            title="Cor personalizada"
          />
          <span className="text-xs" style={{ color: "var(--mw-text-muted)" }}>
            Ou escolha uma cor personalizada
          </span>
        </div>

        {/* Hidden input carries the value to FormData */}
        <input type="hidden" name="color" value={selectedColor} />

        <p className="text-xs mt-2" style={{ color: "var(--mw-text-muted)" }}>
          Esta cor será usada no badge e no acento lateral dos cards de projeto.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Ordem de exibição</label>
        <input
          name="displayOrder"
          type="number"
          min={0}
          defaultValue={category?.displayOrder ?? 0}
          style={{ ...inputStyle, width: 120 }}
          placeholder="0"
        />
        <p className="text-xs mt-1" style={{ color: "var(--mw-text-muted)" }}>
          Menor número = aparece primeiro no catálogo.
        </p>
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
          {isPending
            ? "Salvando…"
            : category
            ? "Salvar Alterações"
            : "Criar Categoria"}
        </button>
        <Link
          href="/admin/categories"
          className="px-6 py-2.5 rounded-mw text-sm font-semibold transition-all"
          style={{
            border: "1px solid var(--mw-border)",
            color: "var(--mw-text-secondary)",
          }}
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
