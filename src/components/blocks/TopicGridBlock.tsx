import type { CSSProperties } from "react";
import { Section } from "@/components/ui/Section";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { updateBlockContainerStyle } from "@/app/actions/editable-blocks";
import { getPublishedTopics } from "@/lib/content";
import { SortableTopicGrid } from "./SortableTopicGrid";
import type { BlockContent } from "@/db/blocks";

export async function TopicGridBlock({ id, content }: { id: string; content: BlockContent<"topic_grid"> }) {
  const { title, description, containerStyle = {} } = content;
  const topics = await getPublishedTopics();
  const sectionStyle: CSSProperties = {
    backgroundColor: containerStyle.background,
    paddingTop: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    paddingBottom: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    marginTop: containerStyle.marginTop != null ? `${containerStyle.marginTop}px` : undefined,
    marginBottom: containerStyle.marginBottom != null ? `${containerStyle.marginBottom}px` : undefined,
  };

  return (
    <Section tone="subtle" style={sectionStyle}>
      <ContainerStyleTrigger
        label="Sección Agenda"
        value={containerStyle}
        supports={{ background: true, padding: true, margin: true }}
        onSave={updateBlockContainerStyle.bind(null, id)}
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <span className="text-[13px] font-bold tracking-[0.14em] text-accent-500 uppercase">
            02 — Agenda
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
      </div>
      <SortableTopicGrid topics={topics} />
    </Section>
  );
}
