import type { CSSProperties } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { EditableArticleGrid } from "./EditableArticleGrid";
import { updateBlockContainerStyle } from "@/app/actions/editable-blocks";
import { getPublishedPosts } from "@/lib/content";
import type { BlockContent } from "@/db/blocks";

export async function ArticleGridBlock({
  id,
  content,
}: {
  id: string;
  content: BlockContent<"article_grid">;
}) {
  const { title, description, limit, ctaLabel, ctaHref, containerStyle = {} } = content;
  const posts = await getPublishedPosts(limit);
  const sectionStyle: CSSProperties = {
    backgroundColor: containerStyle.background,
    paddingTop: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    paddingBottom: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    marginTop: containerStyle.marginTop != null ? `${containerStyle.marginTop}px` : undefined,
    marginBottom: containerStyle.marginBottom != null ? `${containerStyle.marginBottom}px` : undefined,
  };

  return (
    <Section tone="default" style={sectionStyle}>
      <ContainerStyleTrigger
        label="Sección Actualidad"
        value={containerStyle}
        supports={{ background: true, padding: true, margin: true }}
        onSave={updateBlockContainerStyle.bind(null, id)}
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <span className="text-[13px] font-bold tracking-[0.14em] text-accent-500 uppercase">
            03 — Actualidad
          </span>
          <EditableText
            blockId={id}
            field="title"
            value={title}
            as="h2"
            className="mt-3 text-3xl font-black tracking-tight text-fg md:text-4xl"
          />
          {description ? (
            <EditableText
              blockId={id}
              field="description"
              value={description}
              as="p"
              className="mt-3 text-lg text-fg-muted"
              multiline
            />
          ) : null}
        </div>
        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="rounded-[10px] border-[1.5px] border-accent-500 px-6 py-3 text-center text-[15px] font-black whitespace-nowrap text-accent-500 transition-colors hover:bg-accent-500/10"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
      <EditableArticleGrid posts={posts} />
    </Section>
  );
}
