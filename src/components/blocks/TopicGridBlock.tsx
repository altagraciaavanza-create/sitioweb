import { Section } from "@/components/ui/Section";
import { getPublishedTopics } from "@/lib/content";
import { SortableTopicGrid } from "./SortableTopicGrid";
import type { BlockContent } from "@/db/blocks";

export async function TopicGridBlock({ content }: { content: BlockContent<"topic_grid"> }) {
  const { title, description } = content;
  const topics = await getPublishedTopics();

  return (
    <Section tone="default">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
            {title}
          </h2>
          {description ? <p className="mt-3 text-lg text-fg-muted">{description}</p> : null}
        </div>
      </div>
      <SortableTopicGrid topics={topics} />
    </Section>
  );
}
