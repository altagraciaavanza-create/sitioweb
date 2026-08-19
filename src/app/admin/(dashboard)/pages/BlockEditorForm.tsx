"use client";

import { useActionState } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { updateBlockContent, type BlockFormState } from "./actions";
import type { BlockType } from "@/db/blocks";

const initialState: BlockFormState = {};

export function BlockEditorForm({
  pageId,
  slug,
  blockId,
  type,
  content,
}: {
  pageId: string;
  slug: string;
  blockId: string;
  type: BlockType;
  content: Record<string, unknown>;
}) {
  const action = updateBlockContent.bind(null, pageId, slug, blockId, type);
  const [state, formAction, pending] = useActionState(action, initialState);
  const str = (key: string) => (typeof content[key] === "string" ? (content[key] as string) : "");
  const num = (key: string, fallback: number) =>
    typeof content[key] === "number" ? (content[key] as number) : fallback;

  return (
    <form action={formAction} className="space-y-4 border-t border-border pt-4">
      {type === "hero" && (
        <>
          <AdminField label="Eyebrow (opcional)" htmlFor={`${blockId}-eyebrow`}>
            <AdminInput id={`${blockId}-eyebrow`} name="eyebrow" defaultValue={str("eyebrow")} />
          </AdminField>
          <AdminField label="Título" htmlFor={`${blockId}-title`}>
            <AdminInput id={`${blockId}-title`} name="title" required defaultValue={str("title")} />
          </AdminField>
          <AdminField label="Descripción" htmlFor={`${blockId}-description`}>
            <AdminTextarea id={`${blockId}-description`} name="description" rows={2} defaultValue={str("description")} />
          </AdminField>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="CTA principal — texto" htmlFor={`${blockId}-primaryCtaLabel`}>
              <AdminInput
                id={`${blockId}-primaryCtaLabel`}
                name="primaryCtaLabel"
                defaultValue={(content.primaryCta as { label?: string } | undefined)?.label ?? ""}
              />
            </AdminField>
            <AdminField label="CTA principal — link" htmlFor={`${blockId}-primaryCtaHref`}>
              <AdminInput
                id={`${blockId}-primaryCtaHref`}
                name="primaryCtaHref"
                defaultValue={(content.primaryCta as { href?: string } | undefined)?.href ?? ""}
              />
            </AdminField>
            <AdminField label="CTA secundario — texto" htmlFor={`${blockId}-secondaryCtaLabel`}>
              <AdminInput
                id={`${blockId}-secondaryCtaLabel`}
                name="secondaryCtaLabel"
                defaultValue={(content.secondaryCta as { label?: string } | undefined)?.label ?? ""}
              />
            </AdminField>
            <AdminField label="CTA secundario — link" htmlFor={`${blockId}-secondaryCtaHref`}>
              <AdminInput
                id={`${blockId}-secondaryCtaHref`}
                name="secondaryCtaHref"
                defaultValue={(content.secondaryCta as { href?: string } | undefined)?.href ?? ""}
              />
            </AdminField>
          </div>
        </>
      )}

      {type === "rich_text" && (
        <>
          <AdminField label="Título (opcional)" htmlFor={`${blockId}-title`}>
            <AdminInput id={`${blockId}-title`} name="title" defaultValue={str("title")} />
          </AdminField>
          <AdminField label="Contenido" htmlFor={`${blockId}-body`}>
            <AdminTextarea id={`${blockId}-body`} name="body" rows={5} required defaultValue={str("body")} />
          </AdminField>
          <AdminField label="Alineación" htmlFor={`${blockId}-align`}>
            <select
              id={`${blockId}-align`}
              name="align"
              defaultValue={str("align") || "center"}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="center">Centrado</option>
              <option value="left">Izquierda</option>
            </select>
          </AdminField>
        </>
      )}

      {type === "principles" && (
        <>
          <AdminField label="Título" htmlFor={`${blockId}-title`}>
            <AdminInput id={`${blockId}-title`} name="title" defaultValue={str("title")} />
          </AdminField>
          <AdminField
            label="Ítems (uno por línea, formato: Título | Descripción)"
            htmlFor={`${blockId}-items`}
          >
            <AdminTextarea
              id={`${blockId}-items`}
              name="items"
              rows={5}
              defaultValue={
                Array.isArray(content.items)
                  ? (content.items as { title: string; description: string }[])
                      .map((i) => `${i.title} | ${i.description}`)
                      .join("\n")
                  : ""
              }
            />
          </AdminField>
        </>
      )}

      {type === "topic_grid" && (
        <>
          <AdminField label="Título" htmlFor={`${blockId}-title`}>
            <AdminInput id={`${blockId}-title`} name="title" defaultValue={str("title")} />
          </AdminField>
          <AdminField label="Descripción (opcional)" htmlFor={`${blockId}-description`}>
            <AdminTextarea id={`${blockId}-description`} name="description" rows={2} defaultValue={str("description")} />
          </AdminField>
          <p className="text-xs text-fg-muted">Muestra automáticamente todos los ejes temáticos publicados.</p>
        </>
      )}

      {type === "article_grid" && (
        <>
          <AdminField label="Título" htmlFor={`${blockId}-title`}>
            <AdminInput id={`${blockId}-title`} name="title" defaultValue={str("title")} />
          </AdminField>
          <AdminField label="Descripción (opcional)" htmlFor={`${blockId}-description`}>
            <AdminTextarea id={`${blockId}-description`} name="description" rows={2} defaultValue={str("description")} />
          </AdminField>
          <AdminField label="Cantidad a mostrar" htmlFor={`${blockId}-limit`}>
            <AdminInput id={`${blockId}-limit`} name="limit" type="number" min={1} max={12} defaultValue={num("limit", 3)} />
          </AdminField>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Texto del botón (opcional)" htmlFor={`${blockId}-ctaLabel`}>
              <AdminInput id={`${blockId}-ctaLabel`} name="ctaLabel" defaultValue={str("ctaLabel")} />
            </AdminField>
            <AdminField label="Link del botón (opcional)" htmlFor={`${blockId}-ctaHref`}>
              <AdminInput id={`${blockId}-ctaHref`} name="ctaHref" defaultValue={str("ctaHref")} />
            </AdminField>
          </div>
        </>
      )}

      {type === "cta" && (
        <>
          <AdminField label="Eyebrow (opcional)" htmlFor={`${blockId}-eyebrow`}>
            <AdminInput id={`${blockId}-eyebrow`} name="eyebrow" defaultValue={str("eyebrow")} />
          </AdminField>
          <AdminField label="Título" htmlFor={`${blockId}-title`}>
            <AdminInput id={`${blockId}-title`} name="title" required defaultValue={str("title")} />
          </AdminField>
          <AdminField label="Descripción (opcional)" htmlFor={`${blockId}-description`}>
            <AdminTextarea id={`${blockId}-description`} name="description" rows={2} defaultValue={str("description")} />
          </AdminField>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Texto del botón" htmlFor={`${blockId}-ctaLabel`}>
              <AdminInput id={`${blockId}-ctaLabel`} name="ctaLabel" required defaultValue={str("ctaLabel")} />
            </AdminField>
            <AdminField label="Link del botón" htmlFor={`${blockId}-ctaHref`}>
              <AdminInput id={`${blockId}-ctaHref`} name="ctaHref" required defaultValue={str("ctaHref")} />
            </AdminField>
          </div>
        </>
      )}

      {type === "team_grid" && (
        <>
          <AdminField label="Título" htmlFor={`${blockId}-title`}>
            <AdminInput id={`${blockId}-title`} name="title" defaultValue={str("title")} />
          </AdminField>
          <AdminField label="Descripción (opcional)" htmlFor={`${blockId}-description`}>
            <AdminTextarea id={`${blockId}-description`} name="description" rows={2} defaultValue={str("description")} />
          </AdminField>
          <p className="text-xs text-fg-muted">Muestra automáticamente los integrantes publicados.</p>
        </>
      )}

      {type === "image" && (
        <>
          <AdminField label="URL de la imagen" htmlFor={`${blockId}-imageUrl`}>
            <AdminInput id={`${blockId}-imageUrl`} name="imageUrl" required defaultValue={str("imageUrl")} />
          </AdminField>
          <AdminField label="Texto alternativo" htmlFor={`${blockId}-alt`} hint="Obligatorio por accesibilidad.">
            <AdminInput id={`${blockId}-alt`} name="alt" required defaultValue={str("alt")} />
          </AdminField>
          <AdminField label="Epígrafe (opcional)" htmlFor={`${blockId}-caption`}>
            <AdminInput id={`${blockId}-caption`} name="caption" defaultValue={str("caption")} />
          </AdminField>
        </>
      )}

      {type === "empty_state" && (
        <>
          <AdminField label="Título" htmlFor={`${blockId}-title`}>
            <AdminInput id={`${blockId}-title`} name="title" required defaultValue={str("title")} />
          </AdminField>
          <AdminField label="Descripción (opcional)" htmlFor={`${blockId}-description`}>
            <AdminTextarea id={`${blockId}-description`} name="description" rows={2} defaultValue={str("description")} />
          </AdminField>
        </>
      )}

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.success ? <p className="text-sm text-brand-600">Guardado.</p> : null}

      <AdminButton type="submit" variant="secondary" disabled={pending}>
        {pending ? "Guardando..." : "Guardar bloque"}
      </AdminButton>
    </form>
  );
}
