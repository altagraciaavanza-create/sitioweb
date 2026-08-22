"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { useEditMode } from "@/components/editing/EditModeContext";
import { updatePostField, updatePostStyle } from "@/app/actions/editable-blocks";
import { formatDate } from "@/lib/utils";
import type { UpdateItem } from "@/data/updates";
import type { ContainerStyle } from "@/db/blocks";

const categoryLabels: Record<UpdateItem["category"], string> = {
  reuniones: "Reuniones",
  actividades: "Actividades",
  documentos: "Documentos",
  propuestas: "Propuestas",
  comunicados: "Comunicados",
  recorridas: "Recorridas",
  posiciones_institucionales: "Posición institucional",
};

const badgeTones = ["accent", "brandLight", "muted"] as const;

/**
 * Igual razón que SortableTopicGrid.tsx: ArticleCard es un <a> completo
 * (link a /actualidad/[slug]), así que en modo edición no se puede
 * reusar tal cual — el doble clic para editar un texto adentro
 * dispararía la navegación. Acá se arma una versión aparte con
 * título/resumen editables (vía `updatePostField`, la novedad vive en la
 * tabla `posts`) y el link solo en la fecha/badge, no en toda la tarjeta.
 *
 * No tiene reordenamiento (a diferencia de Convicciones/Agenda): las
 * novedades se ordenan solas por fecha de publicación y no tienen una
 * columna de orden manual en la base.
 */
export function EditableArticleGrid({ posts }: { posts: UpdateItem[] }) {
  const { isAdmin, editMode } = useEditMode();
  const editing = isAdmin && editMode;

  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => {
        if (!editing) return <ArticleCard key={post.slug} update={post} index={index} />;

        const tone = badgeTones[index % badgeTones.length];
        const postId = (post as unknown as { id: string }).id;
        const override = post.styleOverrides ?? {};
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
            key={post.slug}
            data-style-box
            className="group/styleable relative flex h-full flex-col gap-3.5 rounded-xl bg-bg-subtle p-7"
            style={cardStyle}
          >
            <ContainerStyleTrigger
              label={`Tarjeta — ${post.title}`}
              value={override}
              supports={{ background: true, padding: true, radius: true, paddingMax: 64, width: true, widthMax: 400, margin: true }}
              axis="all"
              position="top-left"
              onSave={(style: ContainerStyle) => updatePostStyle(postId, style)}
            />
            <Link href={`/actualidad/${post.slug}`}>
              <Badge
                tone={
                  tone === "accent" ? "solid-accent" : tone === "brandLight" ? "solid-brand-light" : "solid-muted"
                }
              >
                {categoryLabels[post.category]}
              </Badge>
            </Link>
            <Link href={`/actualidad/${post.slug}`} className="text-[13px] font-bold text-fg-muted">
              {formatDate(post.date)}
            </Link>
            <EditableText
              blockId={postId}
              field="title"
              value={post.title}
              as="h3"
              className="text-lg font-black text-fg"
              onSave={(patch) => updatePostField(postId, { title: String(patch.title ?? post.title) })}
            />
            <EditableText
              blockId={postId}
              field="excerpt"
              value={post.excerpt}
              as="p"
              className="text-sm leading-relaxed text-fg-muted"
              multiline
              onSave={(patch) => updatePostField(postId, { excerpt: String(patch.excerpt ?? post.excerpt) })}
            />
          </div>
        );
      })}
    </div>
  );
}
