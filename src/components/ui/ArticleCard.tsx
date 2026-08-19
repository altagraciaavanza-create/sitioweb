import Link from "next/link";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { formatDate } from "@/lib/utils";
import type { UpdateItem } from "@/data/updates";

const categoryLabels: Record<UpdateItem["category"], string> = {
  reuniones: "Reunión",
  actividades: "Actividad",
  documentos: "Documento",
  propuestas: "Propuesta",
  comunicados: "Comunicado",
  recorridas: "Recorrida",
  posiciones_institucionales: "Posición institucional",
};

export function ArticleCard({ update }: { update: UpdateItem }) {
  return (
    <Link href={`/actualidad/${update.slug}`} className="block h-full">
      <Card className="flex h-full flex-col gap-3 hover:border-brand-300">
        <Badge tone="neutral">{categoryLabels[update.category]}</Badge>
        <h3 className="text-lg font-semibold text-fg">{update.title}</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{update.excerpt}</p>
        <time dateTime={update.date} className="mt-auto text-xs text-fg-muted">
          {formatDate(update.date)}
        </time>
      </Card>
    </Link>
  );
}
