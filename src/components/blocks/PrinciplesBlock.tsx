"use client";

import type { CSSProperties, ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { SortableItemGrid } from "@/components/editing/SortableItemGrid";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { ElementColorTrigger } from "@/components/editing/ElementColorTrigger";
import { updateBlockField } from "@/app/actions/editable-blocks";
import type { BlockContent, ContainerStyle } from "@/db/blocks";

/**
 * Los 5 íconos de línea del mockup de la landing, uno por convicción.
 * Se mapean por título — si en algún momento se agrega una convicción con
 * un título que no está acá, se usa un ícono genérico en vez de romper.
 */
const ICONS: Record<string, ReactNode> = {
  Libertad: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7a4 4 0 0 1 7.5-1.9" />
    </>
  ),
  Transparencia: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  Desarrollo: (
    <>
      <path d="M3 20h18" />
      <rect x="5" y="14" width="3.2" height="6" />
      <rect x="10.4" y="9" width="3.2" height="11" />
      <rect x="15.8" y="4" width="3.2" height="16" />
    </>
  ),
  Instituciones: (
    <>
      <path d="M4 21V10l8-5 8 5v11" />
      <path d="M9 21v-6h6v6" />
      <path d="M4 21h16" />
    </>
  ),
  Participación: (
    <>
      <circle cx="9" cy="10" r="4.5" />
      <circle cx="16" cy="13" r="4.5" />
    </>
  ),
};

const DEFAULT_ICON = (
  <>
    <circle cx="12" cy="12" r="8" />
  </>
);

function PrincipleIcon({ title, color }: { title: string; color?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mb-5 text-brand-500"
      style={color ? { color } : undefined}
    >
      {ICONS[title] ?? DEFAULT_ICON}
    </svg>
  );
}

export function PrinciplesBlock({ id, content }: { id: string; content: BlockContent<"principles"> }) {
  const { title, items, containerStyle = {} } = content;
  const sectionStyle: CSSProperties = {
    backgroundColor: containerStyle.background,
    paddingTop: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    paddingBottom: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    marginTop: containerStyle.marginTop != null ? `${containerStyle.marginTop}px` : undefined,
    marginBottom: containerStyle.marginBottom != null ? `${containerStyle.marginBottom}px` : undefined,
  };

  // Los ítems no tienen id propio (son un array plano en el content del
  // bloque) — para editar el título, la descripción o el estilo de UNO
  // puntual, hay que reconstruir el array completo con ese ítem
  // actualizado y guardarlo entero vía updateBlockField. Se identifica el
  // ítem por su título ORIGINAL (capturado al armar la lista), no por el
  // título en pantalla, para no perderlo de vista si el usuario lo está
  // editando.
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
        label="Sección Convicciones"
        value={containerStyle}
        supports={{ background: true, padding: true, margin: true }}
        onSave={(style) => updateBlockField(id, { containerStyle: style })}
      />
      <span className="text-[13px] font-bold tracking-[0.14em] text-[#93491a] uppercase">
        01 — Convicciones
      </span>
      <EditableText
        blockId={id}
        field="title"
        value={title}
        as="h2"
        className="mt-3 mb-14 text-3xl font-black tracking-tight text-fg md:text-4xl"
      />
      <SortableItemGrid
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
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
              className="group/styleable relative h-full border-t-2 border-fg/15 pt-6"
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
              <span style={{ position: "relative", display: "inline-block" }}>
                <PrincipleIcon title={item.title} color={item.iconColor} />
                <ElementColorTrigger
                  label={`Color del ícono — ${item.title}`}
                  value={item.iconColor}
                  onSave={(color) => saveItemField(item.title, { iconColor: color })()}
                />
              </span>
              <EditableText
                blockId={id}
                field="title"
                value={item.title}
                as="h3"
                className="text-lg font-black text-fg"
                onSave={(patch) => saveItemField(item.title, { title: String(patch.title ?? item.title) })()}
              />
              <EditableText
                blockId={id}
                field="description"
                value={item.description}
                as="p"
                className="mt-2.5 text-sm leading-relaxed text-fg-muted"
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
