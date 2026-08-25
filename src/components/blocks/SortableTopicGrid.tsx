"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { TopicCard } from "@/components/ui/TopicCard";
import { SortableItemGrid } from "@/components/editing/SortableItemGrid";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { useEditMode } from "@/components/editing/EditModeContext";
import { reorderTopicsPublic, updateTopicField, updateTopicStyle } from "@/app/actions/editable-blocks";
import type { Topic } from "@/data/topics";
import type { ContainerStyle } from "@/db/blocks";

/**
 * La grilla de ejes temáticos en modo edición: a diferencia de los bloques
 * de contenido (hero, texto, principios), los topics viven en su propia
 * tabla (con su propia columna `order`), así que el reordenamiento se
 * persiste con `reorderTopicsPublic` en vez de `updateBlockField`, y el
 * título/resumen de cada uno con `updateTopicField`.
 *
 * Fuera de modo edición la tarjeta entera es un link a /ideas/[slug]
 * (TopicCard.tsx). En modo edición eso no puede ser así — hacer doble
 * clic para editar un texto adentro de un <a> dispararía la navegación —
 * así que ahí se arma una versión con el título/resumen editables y un
 * link "Ver propuesta →" aparte, en vez de reusar TopicCard.
 */
export function SortableTopicGrid({ topics }: { topics: Topic[] }) {
  const { isAdmin, editMode } = useEditMode();
  const editing = isAdmin && editMode;

  return (
    <SortableItemGrid
      className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      items={topics}
      getId={(topic) => topic.slug}
      onReorder={async (orderedSlugs) => {
        const reordered = orderedSlugs
          .map((slug) => topics.find((t) => t.slug === slug))
          .filter((t): t is Topic => Boolean(t));
        const ids = reordered.map((t) => (t as unknown as { id: string }).id);
        return reorderTopicsPublic(ids);
      }}
      renderItem={(topic) => {
        if (!editing) return <TopicCard topic={topic} />;

        const topicId = (topic as unknown as { id: string }).id;
        const override = topic.styleOverrides ?? {};
        const cardStyle: CSSProperties = {
          backgroundColor: override.background,
          padding: override.padding != null ? `${override.padding}px` : undefined,
          borderRadius: override.radius != null ? `${override.radius}px` : undefined,
          maxWidth: override.width != null ? `${override.width}px` : undefined,
          marginTop: override.marginTop != null ? `${override.marginTop}px` : undefined,
          marginBottom: override.marginBottom != null ? `${override.marginBottom}px` : undefined,
        };
        return (
          <div
            data-style-box
            className="group/styleable relative block h-full rounded-xl border border-fg/10 bg-bg p-7"
            style={cardStyle}
          >
            <ContainerStyleTrigger
              label={`Tarjeta — ${topic.title}`}
              value={override}
              supports={{ background: true, padding: true, radius: true, paddingMax: 64, width: true, widthMax: 400, margin: true }}
              axis="all"
              position="top-left"
              onSave={(style: ContainerStyle) => updateTopicStyle(topicId, style)}
            />
            <EditableText
              blockId={topicId}
              field="title"
              value={topic.title}
              as="h3"
              className="text-lg font-black text-fg"
              onSave={(patch) => updateTopicField(topicId, { title: String(patch.title ?? topic.title) })}
            />
            <EditableText
              blockId={topicId}
              field="summary"
              value={topic.summary}
              as="p"
              className="mt-2.5 text-sm leading-relaxed text-fg-muted"
              multiline
              onSave={(patch) => updateTopicField(topicId, { summary: String(patch.summary ?? topic.summary) })}
            />
            {/* Ver TopicCard.tsx: mismo fix de contraste. */}
            <Link
              href={`/ideas/${topic.slug}`}
              className="mt-4 inline-flex items-center text-sm font-bold text-[#93491a]"
            >
              Ver propuesta →
            </Link>
          </div>
        );
      }}
    />
  );
}
