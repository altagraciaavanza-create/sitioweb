"use client";

import { TopicCard } from "@/components/ui/TopicCard";
import { SortableItemGrid } from "@/components/editing/SortableItemGrid";
import { reorderTopicsPublic } from "@/app/actions/editable-blocks";
import type { Topic } from "@/data/topics";

/**
 * La grilla de ejes temáticos en modo edición: a diferencia de los bloques
 * de contenido (hero, texto, principios), los topics viven en su propia
 * tabla (con su propia columna `order`), así que el reordenamiento se
 * persiste con `reorderTopicsPublic` en vez de `updateBlockField`.
 */
export function SortableTopicGrid({ topics }: { topics: Topic[] }) {
  return (
    <SortableItemGrid
      className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      items={topics}
      getId={(topic) => topic.slug}
      onReorder={async (orderedSlugs) => {
        const reordered = orderedSlugs
          .map((slug) => topics.find((t) => t.slug === slug))
          .filter((t): t is Topic => Boolean(t));
        const ids = reordered.map((t) => (t as unknown as { id: string }).id);
        return reorderTopicsPublic(ids);
      }}
      renderItem={(topic) => <TopicCard topic={topic} />}
    />
  );
}
