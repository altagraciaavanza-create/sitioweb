"use client";

import { useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toast } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // OJO: `lastPropsIds` sigue únicamente lo que llegó por props (los datos
  // del servidor), nunca lo que acabamos de arrastrar nosotros. Si se usara
  // la misma variable para las dos cosas (como pasaba antes), el propio
  // arrastre local se malinterpretaba como "llegaron props nuevas" en el
  // render inmediatamente posterior (los props todavía no cambiaron, sigue
  // en vuelo el guardado) y se deshacía solo, antes de que el guardado
  // siquiera terminara — esa era la causa del "se mueve y vuelve a su
  // lugar".
  const currentIds = items.map(getId).join(",");
  const [lastPropsIds, setLastPropsIds] = useState(currentIds);
  if (currentIds !== lastPropsIds) {
    setLastPropsIds(currentIds);
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

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((item) => getId(item) === active.id);
    const newIndex = ordered.findIndex((item) => getId(item) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = [...ordered];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setOrdered(reordered);

    const result = await onReorder(reordered.map(getId));
    if (result.error) {
      toast({ variant: "danger", title: "No se pudo reordenar", description: result.error });
    }
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const activeItem = activeId != null ? ordered.find((item) => getId(item) === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={ordered.map(getId)} strategy={rectSortingStrategy}>
        <div className={className}>
          {ordered.map((item) => (
            <SortableItem key={getId(item)} id={getId(item)} isActive={getId(item) === activeId}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>{activeItem ? <div className="opacity-90 shadow-2xl">{renderItem(activeItem)}</div> : null}</DragOverlay>
    </DndContext>
  );
}

function SortableItem({ id, children, isActive }: { id: string; children: ReactNode; isActive?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isActive ? 0.4 : 1,
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
