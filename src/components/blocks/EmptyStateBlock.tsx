import { Section } from "@/components/ui/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BlockContent } from "@/db/blocks";

export function EmptyStateBlock({ content }: { content: BlockContent<"empty_state"> }) {
  return (
    <Section tone="default">
      <EmptyState title={content.title} description={content.description} />
    </Section>
  );
}
