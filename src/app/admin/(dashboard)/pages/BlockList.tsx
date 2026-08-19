"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AdminCard } from "@/components/admin/admin-ui";
import { blockRegistrySchema, type BlockType } from "@/db/blocks";
import { deleteBlock, reorderBlocks } from "./actions";
import { BlockEditorForm } from "./BlockEditorForm";

type Block = {
  id: string;
  type: string;
  content: Record<string, unknown>;
};

function SortableBlock({
  block,
  pageId,
  slug,
  expanded,
  onToggle,
}: {
  block: Block;
  pageId: string;
  slug: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const label = blockRegistrySchema[block.type as BlockType]?.label ?? block.type;

  return (
    <div ref={setNodeRef} style={style}>
      <AdminCard>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="cursor-grab rounded-md border border-border px-2 py-1 text-xs text-fg-muted active:cursor-grabbing"
              aria-label="Arrastrar para reordenar"
            >
              ⠿
            </button>
            <span className="text-sm font-semibold text-fg">{label}</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onToggle} className="text-sm text-brand-600 hover:underline">
              {expanded ? "Cerrar" : "Editar contenido"}
            </button>
            <form action={deleteBlock.bind(null, pageId, slug, block.id)}>
              <button type="submit" className="text-sm text-red-600 hover:underline">
                Eliminar
              </button>
            </form>
          </div>
        </div>

        {expanded ? (
          <BlockEditorForm
            pageId={pageId}
            slug={slug}
            blockId={block.id}
            type={block.type as BlockType}
            content={block.content}
          />
        ) : null}
      </AdminCard>
    </div>
  );
}

export function BlockList({
  pageId,
  slug,
  blocks,
}: {
  pageId: string;
  slug: string;
  blocks: Block[];
}) {
  const [items, setItems] = useState(blocks);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((b) => b.id === active.id);
    const newIndex = items.findIndex((b) => b.id === over.id);
    const reordered = [...items];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setItems(reordered);

    await reorderBlocks(
      pageId,
      slug,
      reordered.map((b) => b.id)
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-fg-muted">
        Esta página todavía no tiene bloques. Agregá uno abajo.
      </p>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              pageId={pageId}
              slug={slug}
              expanded={expandedId === block.id}
              onToggle={() => setExpandedId(expandedId === block.id ? null : block.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
