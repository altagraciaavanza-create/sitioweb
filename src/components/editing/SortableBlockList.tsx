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
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditMode } from "./EditModeContext";
import { reorderPageBlocksPublic } from "@/app/actions/editable-blocks";
import { useToast } from "@/components/ui/Toast";

type BlockItem = { id: string; node: ReactNode };

/**
 * Envuelve las secciones de una página (ver PageRenderer.tsx) para que, en
 * modo edición en vivo, cada una se pueda arrastrar y soltar para
 * reordenarla — la misma mecánica de drag & drop que ya existía en
 * /admin/pages (ver BlockList.tsx), pero directamente sobre el sitio
 * público. Fuera de modo edición no agrega ningún marcado extra: renderiza
 * los bloques tal cual.
 */
export function SortableBlockList({ pageId, items }: { pageId: string; items: BlockItem[] }) {
  const { isAdmin, editMode } = useEditMode();
  const [ordered, setOrdered] = useState(items);
  const { toast } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Si cambió el contenido de la página (revalidación tras guardar un
  // texto, por ejemplo) resincronizamos el orden base con lo que llegó del
  // servidor, sin perder reordenamientos ya aplicados en este render.
  const currentIds = items.map((b) => b.id).join(",");
  const [lastIds, setLastIds] = useState(currentIds);
  if (currentIds !== lastIds) {
    setLastIds(currentIds);
    setOrdered(items);
  }

  if (!isAdmin || !editMode) {
    return <>{items.map((item) => <div key={item.id}>{item.node}</div>)}</>;
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((b) => b.id === active.id);
    const newIndex = ordered.findIndex((b) => b.id === over.id);
    const reordered = [...ordered];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setOrdered(reordered);
    setLastIds(reordered.map((b) => b.id).join(","));

    const result = await reorderPageBlocksPublic(pageId, reordered.map((b) => b.id));
    if (result.error) {
      toast({ variant: "danger", title: "No se pudo reordenar", description: result.error });
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ordered.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        {ordered.map((item) => (
          <SortableSection key={item.id} id={item.id}>
            {item.node}
          </SortableSection>
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableSection({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group/section relative">
      <button
        type="button"
        {...attributes}
        {...listeners}
        title="Arrastrar para reordenar esta sección"
        className="absolute top-3 left-3 z-40 flex h-8 w-8 cursor-grab items-center justify-center rounded-full border-2 border-white bg-brand-500 text-white opacity-0 shadow-lg transition-opacity group-hover/section:opacity-100 active:cursor-grabbing"
      >
        ⠿
      </button>
      <div className="outline outline-1 outline-dashed outline-transparent group-hover/section:outline-brand-300/50">
        {children}
      </div>
    </div>
  );
}
