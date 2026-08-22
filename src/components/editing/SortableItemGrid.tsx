"use client";

import { useState, type ReactNode } from "react";
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
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditMode } from "./EditModeContext";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

/**
 * Grilla genérica de tarjetas reordenables en modo edición en vivo: cubre
 * el caso de "mover cada elemento suelto dentro de una sección" (una
 * convicción puntual, un eje de la agenda), a diferencia de
 * SortableBlockList.tsx que reordena secciones completas.
 *
 * No sabe nada de dónde se persiste el nuevo orden — eso lo decide quien
 * lo usa vía `onReorder` (ver PrinciplesBlock.tsx / TopicGridBlock.tsx).
 * Fuera de modo edición renderiza la grilla tal cual, sin costo extra.
 */
export function SortableItemGrid<T>({
  items,
  getId,
  renderItem,
  onReorder,
  className,
}: {
  items: T[];
  getId: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onReorder: (orderedIds: string[]) => Promise<{ error?: string }>;
  className?: string;
}) {
  const { isAdmin, editMode } = useEditMode();
  const [ordered, setOrdered] = useState(items);
  const { toast } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const currentIds = items.map(getId).join(",");
  const [lastIds, setLastIds] = useState(currentIds);
  if (currentIds !== lastIds) {
    setLastIds(currentIds);
    setOrdered(items);
  }

  if (!isAdmin || !editMode) {
    return (
      <div className={className}>
        {items.map((item) => (
          <div key={getId(item)}>{renderItem(item)}</div>
        ))}
      </div>
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((item) => getId(item) === active.id);
    const newIndex = ordered.findIndex((item) => getId(item) === over.id);
    const reordered = [...ordered];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setOrdered(reordered);
    setLastIds(reordered.map(getId).join(","));

    const result = await onReorder(reordered.map(getId));
    if (result.error) {
      toast({ variant: "danger", title: "No se pudo reordenar", description: result.error });
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ordered.map(getId)} strategy={rectSortingStrategy}>
        <div className={className}>
          {ordered.map((item) => (
            <SortableItem key={getId(item)} id={getId(item)}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group/item relative h-full">
      <button
        type="button"
        {...attributes}
        {...listeners}
        title="Arrastrar para reordenar"
        className="absolute top-2 right-2 z-40 flex h-7 w-7 cursor-grab items-center justify-center rounded-full border-2 border-white bg-brand-500 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover/item:opacity-100 active:cursor-grabbing"
      >
        ⠿
      </button>
      <div
        className={cn(
          "h-full rounded outline outline-1 outline-dashed outline-transparent group-hover/item:outline-brand-300/50"
        )}
      >
        {children}
      </div>
    </div>
  );
}
