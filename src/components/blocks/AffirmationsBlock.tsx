import type { CSSProperties } from "react";
import { Section } from "@/components/ui/Section";
import { SortableItemGrid } from "@/components/editing/SortableItemGrid";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { updateBlockField, updateBlockContainerStyle } from "@/app/actions/editable-blocks";
import type { BlockContent, ContainerStyle } from "@/db/blocks";

/**
 * Lista de frases/afirmaciones destacadas, cada una con un borde de color a
 * la izquierda (sin fondo de tarjeta) — pensado para la página Visión. Cada
 * afirmación es editable y reordenable por separado, igual mecánica que
 * PrinciplesBlock/InfoCardsBlock.
 */
export function AffirmationsBlock({ id, content }: { id: string; content: BlockContent<"affirmations"> }) {
  const { title, items, containerStyle = {} } = content;
  const sectionStyle: CSSProperties = {
    backgroundColor: containerStyle.background,
    paddingTop: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    paddingBottom: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    marginTop: containerStyle.marginTop != null ? `${containerStyle.marginTop}px` : undefined,
    marginBottom: containerStyle.marginBottom != null ? `${containerStyle.marginBottom}px` : undefined,
  };

  // Los ítems no tienen id propio (son un array plano) — se identifican
  // por su texto ORIGINAL, igual que en PrinciplesBlock/InfoCardsBlock.
  function saveItemField(originalText: string, patch: Record<string, unknown>) {
    return async () => {
      const updated = items.map((item) =>
        item.text === originalText ? { ...item, ...patch } : item
      );
      return updateBlockField(id, { items: updated });
    };
  }

  return (
    <Section tone="default" style={sectionStyle}>
      <ContainerStyleTrigger
        label="Sección de afirmaciones"
        value={containerStyle}
        supports={{ background: true, padding: true, margin: true }}
        onSave={updateBlockContainerStyle.bind(null, id)}
      />
      <div className="mx-auto max-w-3xl">
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
          className="flex flex-col gap-10"
          items={items}
          getId={(item) => item.text}
          onReorder={async (orderedTexts) => {
            const reordered = orderedTexts
              .map((t) => items.find((item) => item.text === t))
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
                className="group/styleable relative border-l-4 border-brand-500 pl-6"
                style={itemStyle}
              >
                <ContainerStyleTrigger
                  label="Afirmación"
                  value={item.style ?? {}}
                  supports={{ background: true, padding: true, radius: true, paddingMax: 64, width: true, widthMax: 400, margin: true }}
                  axis="all"
                  position="top-left"
                  onSave={(style: ContainerStyle) => saveItemField(item.text, { style })()}
                />
                <EditableText
                  blockId={id}
                  field="text"
                  value={item.text}
                  as="p"
                  className="text-2xl font-semibold leading-snug text-fg md:text-3xl"
                  multiline
                  onSave={(patch) => saveItemField(item.text, { text: String(patch.text ?? item.text) })()}
                />
              </div>
            );
          }}
        />
      </div>
    </Section>
  );
}
