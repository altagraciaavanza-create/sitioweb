"use client";

import { useRef } from "react";
import { useEditMode } from "./EditModeContext";
import { useStyleEditor, type StyleSupports } from "./StyleEditorContext";
import type { ContainerStyle } from "@/db/blocks";
import { cn } from "@/lib/utils";

/**
 * El engranaje que, en modo edición en vivo, abre el panel de estilo
 * (fondo/espaciado/bordes) del contenedor sobre el que está — una sección
 * completa o una tarjeta puntual. No renderiza el contenedor en sí: se
 * espera que viva DENTRO de un elemento marcado con `data-style-box`
 * (Section.tsx ya lo trae; para tarjetas sueltas hay que agregarlo a mano,
 * ver TopicCard.tsx/ArticleCard.tsx/PrinciplesBlock.tsx).
 *
 * Para dar feedback instantáneo sin convertir cada bloque (la mayoría
 * Server Components) en cliente con estado propio, el cambio en vivo se
 * aplica escribiendo directo sobre el `style` del DOM del contenedor más
 * cercano (vía closest) — un atajo deliberado, acotado a este componente.
 * Lo que persiste en la base es el valor que finalmente confirma
 * ContainerStylePanel.tsx vía `onSave`.
 */
export function ContainerStyleTrigger({
  label,
  value,
  supports,
  onSave,
  /** "y" = arriba/abajo (secciones); "all" = las cuatro direcciones (tarjetas). */
  axis = "y",
  position = "top-right",
}: {
  label: string;
  value: ContainerStyle;
  supports: StyleSupports;
  onSave: (style: ContainerStyle) => Promise<{ error?: string } | void>;
  axis?: "y" | "all";
  position?: "top-right" | "top-left";
}) {
  const { isAdmin, editMode } = useEditMode();
  const { open } = useStyleEditor();
  const ref = useRef<HTMLButtonElement>(null);

  if (!isAdmin || !editMode) return null;

  function applyLocal(style: ContainerStyle) {
    const box = ref.current?.closest("[data-style-box]") as HTMLElement | null;
    if (!box) return;
    box.style.backgroundColor = style.background || "";
    if (axis === "all") {
      box.style.padding = style.padding != null ? `${style.padding}px` : "";
    } else {
      box.style.paddingTop = style.padding != null ? `${style.padding}px` : "";
      box.style.paddingBottom = style.padding != null ? `${style.padding}px` : "";
    }
    box.style.borderRadius = style.radius != null ? `${style.radius}px` : "";
    box.style.maxWidth = style.width != null ? `${style.width}px` : "";
    box.style.marginTop = style.marginTop != null ? `${style.marginTop}px` : "";
    box.style.marginBottom = style.marginBottom != null ? `${style.marginBottom}px` : "";
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => open({ label, value, supports, onChange: applyLocal, onSave })}
      title={`Estilo — ${label}`}
      className={cn(
        "absolute z-40 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-bg-subtle text-sm text-fg opacity-0 shadow-lg transition-opacity group-hover/styleable:opacity-100",
        position === "top-right" ? "top-3 right-3" : "top-2 left-2"
      )}
    >
      ⚙
    </button>
  );
}
