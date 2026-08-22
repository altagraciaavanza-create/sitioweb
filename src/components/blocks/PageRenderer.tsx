import type { PageBlockData } from "@/db/blocks";
import { SortableBlockList } from "@/components/editing/SortableBlockList";
import { renderBlock } from "./registry";

export function PageRenderer({ pageId, blocks }: { pageId: string; blocks: PageBlockData[] }) {
  const items = blocks.map((block, index) => ({
    id: block.id,
    node: renderBlock(block, index),
  }));

  return <SortableBlockList pageId={pageId} items={items} />;
}
