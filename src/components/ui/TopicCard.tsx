import type { CSSProperties } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Topic } from "@/data/topics";

export function TopicCard({ topic }: { topic: Topic }) {
  const override = topic.styleOverrides ?? {};
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
      href={`/ideas/${topic.slug}`}
      style={style}
      className={cn(
        "block h-full rounded-xl border border-fg/10 bg-bg p-7",
        "transition-colors duration-150 hover:border-brand-500"
      )}
    >
      <h3 className="text-lg font-black text-fg">{topic.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{topic.summary}</p>
      {/* accent-500 (~3.09:1) y accent-600 (~4.44:1) sobre fondo blanco no
          alcanzan el mínimo de 4.5:1 para texto normal (WCAG AA) — se usa
          un tono más oscuro de la misma familia (~6.5:1) solo para este
          texto. No está atado al sistema de theming admin-editable
          (accent500/600 en /admin/identidad): si se cambia el color de
          marca desde ahí, este valor no lo sigue automáticamente. */}
      <span className="mt-4 inline-flex items-center text-sm font-bold text-[#93491a]">
        Ver propuesta →
      </span>
    </Link>
  );
}
