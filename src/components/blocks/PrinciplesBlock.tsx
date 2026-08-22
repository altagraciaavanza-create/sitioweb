"use client";

import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { SortableItemGrid } from "@/components/editing/SortableItemGrid";
import { updateBlockField } from "@/app/actions/editable-blocks";
import type { BlockContent } from "@/db/blocks";

export function PrinciplesBlock({ id, content }: { id: string; content: BlockContent<"principles"> }) {
  const { title, items } = content;

  return (
    <Section tone="subtle">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
          {title}
        </h2>
      </div>
      <SortableItemGrid
        className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5"
        items={items}
        getId={(item) => item.title}
        onReorder={async (orderedTitles) => {
          const reordered = orderedTitles
            .map((t) => items.find((item) => item.title === t))
            .filter((item): item is (typeof items)[number] => Boolean(item));
          return updateBlockField(id, { items: reordered });
        }}
        renderItem={(item) => (
          <Card className="h-full">
            <h3 className="text-lg font-semibold text-fg">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.description}</p>
          </Card>
        )}
      />
    </Section>
  );
}
