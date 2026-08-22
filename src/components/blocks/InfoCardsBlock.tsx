import type { CSSProperties } from "react";
import { Section } from "@/components/ui/Section";
import { SortableItemGrid } from "@/components/editing/SortableItemGrid";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { updateBlockField, updateBlockContainerStyle } from "@/app/actions/editable-blocks";
import type { BlockContent, ContainerStyle } from "@/db/blocks";

/**
 * Grilla genérica de tarjetas chicas (título + texto) — misma mecánica que
 * PrinciplesBlock (SortableItemGrid, edición por ítem, estilo por tarjeta)
 * pero sin la numeración de sección ("01 — Convicciones") ni los íconos,
 * pensada para bloques institucionales sueltos como "Por qué nacemos" en
 * la página Nosotros.
 */
export function InfoCardsBlock({ id, content }: { id: string; content: BlockContent<"info_cards"> }) {
  const { title, items, containerStyle = {} } = content;
  const sectionStyle: CSSProperties = {
    backgroundColor: containerStyle.background,
    paddingTop: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    paddingBottom: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    marginTop: containerStyle.marginTop != null ? `${containerStyle.marginTop}px` : undefined,
    marginBottom: containerStyle.marginBottom != null ? `${containerStyle.marginBottom}px` : undefined,
  };

  // Igual que en PrinciplesBlock: los ítems no tienen id propio, se
  // identifican por su título ORIGINAL (capturado al armar la lista).
  function saveItemField(originalTitle: string, patch: Record<string, unknown>) {
    return async () => {
      const updated = items.map((item) =>
        item.title === originalTitle ? { ...item, ...patch } : item
      );
      return updateBlockField(id, { items: updated });
    };
  }

  return (
    <Section tone="default" style={sectionStyle}>
      <ContainerStyleTrigger
        label="Sección de tarjetas"
        value={containerStyle}
        supports={{ background: true, padding: true, margin: true }}
        onSave={updateBlockContainerStyle.bind(null, id)}
      />
      {title ? (
        <EditableText
          blockId={id}
          field="title"
          value={title}
          as="h2"
          className="mb-10 text-2xl font-black tracking-tight text-fg md:text-3xl"
        />
      ) : null}
      <SortableItemGrid
        className="grid grid-cols-1 gap-6 sm:grid-cols-3"
        items={items}
        getId={(item) => item.title}
        onReorder={async (orderedTitles) => {
          const reordered = orderedTitles
            .map((t) => items.find((item) => item.title === t))
            .filter((item): item is (typeof items)[number] => Boolean(item));
          return updateBlockField(id, { items: reordered });
        }}
        renderItem={(item) => {
          const itemStyle: CSSProperties = {
            backgroundColor: item.style?.background,
            padding: item.style?.padding != null ? `${item.style.padding}px` : undefined,
            borderRadius: item.style?.radius != null ? `${item.style.radius}px` : undefined,
            maxWidth: item.style?.width != null ? `${item.style.width}px` : undefined,
            marginTop: item.style?.marginTop != null ? `${item.style.marginTop}px` : undefined,
            marginBottom: item.style?.marginBottom != null ? `${item.style.marginBottom}px` : undefined,
          };
          return (
            <div
              data-style-box
              className="group/styleable relative h-full rounded-lg border border-border p-6"
              style={itemStyle}
            >
              <ContainerStyleTrigger
                label={`Tarjeta — ${item.title}`}
                value={item.style ?? {}}
                supports={{ background: true, padding: true, radius: true, paddingMax: 64, width: true, widthMax: 400, margin: true }}
                axis="all"
                position="top-left"
                onSave={(style: ContainerStyle) => saveItemField(item.title, { style })()}
              />
              <EditableText
                blockId={id}
                field="title"
                value={item.title}
                as="h3"
                className="text-base font-semibold text-fg"
                onSave={(patch) => saveItemField(item.title, { title: String(patch.title ?? item.title) })()}
              />
              <EditableText
                blockId={id}
                field="description"
                value={item.description}
                as="p"
                className="mt-2 text-sm text-fg-muted"
                multiline
                onSave={(patch) =>
                  saveItemField(item.title, { description: String(patch.description ?? item.description) })()
                }
              />
            </div>
          );
        }}
      />
    </Section>
  );
}
