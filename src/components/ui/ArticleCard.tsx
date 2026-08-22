import type { CSSProperties } from "react";
import Link from "next/link";
import { Badge } from "./Badge";
import { formatDate } from "@/lib/utils";
import type { UpdateItem } from "@/data/updates";

const categoryLabels: Record<UpdateItem["category"], string> = {
  reuniones: "Reuniones",
  actividades: "Actividades",
  documentos: "Documentos",
  propuestas: "Propuestas",
  comunicados: "Comunicados",
  recorridas: "Recorridas",
  posiciones_institucionales: "Posición institucional",
};

// Rotan tres colores sólidos de marca para las etiquetas, como en el
// mockup de la landing — no hace falta un color distinto por categoría,
// solo variedad visual entre tarjetas.
const badgeTones = ["accent", "brandLight", "muted"] as const;

export function ArticleCard({ update, index = 0 }: { update: UpdateItem; index?: number }) {
  const tone = badgeTones[index % badgeTones.length];
  const override = update.styleOverrides ?? {};
  const style: CSSProperties = {
    backgroundColor: override.background,
    padding: override.padding != null ? `${override.padding}px` : undefined,
    borderRadius: override.radius != null ? `${override.radius}px` : undefined,
    maxWidth: override.width != null ? `${override.width}px` : undefined,
    marginTop: override.marginTop != null ? `${override.marginTop}px` : undefined,
    marginBottom: override.marginBottom != null ? `${override.marginBottom}px` : undefined,
  };

  return (
    <Link
      href={`/actualidad/${update.slug}`}
      style={style}
      className="flex h-full flex-col gap-3.5 rounded-xl bg-bg-subtle p-7 transition-opacity duration-150 hover:opacity-90"
    >
      <Badge tone={tone === "accent" ? "solid-accent" : tone === "brandLight" ? "solid-brand-light" : "solid-muted"}>
        {categoryLabels[update.category]}
      </Badge>
      <time dateTime={update.date} className="text-[13px] font-bold text-fg-muted">
        {formatDate(update.date)}
      </time>
      <h3 className="text-lg font-black text-fg">{update.title}</h3>
      <p className="text-sm leading-relaxed text-fg-muted">{update.excerpt}</p>
    </Link>
  );
}
