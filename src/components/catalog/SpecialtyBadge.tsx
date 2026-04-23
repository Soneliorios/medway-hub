import { getSpecialtyStyle } from "@/lib/utils";

interface SpecialtyBadgeProps {
  category: string;
  color?: string;
  className?: string;
}

export function SpecialtyBadge({
  category,
  color = "#01CFB5",
  className = "",
}: SpecialtyBadgeProps) {
  const { color: c, bg } = getSpecialtyStyle(color);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-mw-lg ${className}`}
      style={{ background: bg, color: c }}
    >
      {category}
    </span>
  );
}

export function NewBadge() {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-mw-lg uppercase tracking-wider"
      style={{ background: "var(--mw-teal)", color: "var(--mw-navy)" }}
    >
      Novo
    </span>
  );
}
