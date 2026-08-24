"use client";

import { useEditMode } from "./EditModeContext";
import { useStyleEditor, type StyleSupports } from "./StyleEditorContext";
import type { ContainerStyle } from "@/db/blocks";

/**
 * El ícono "Aa" que, en modo edición en vivo, abre el mismo panel de
 * estilo que usan las secciones/tarjetas (ContainerStylePanel.tsx) pero
 * para un TEXTO puntual — tamaño de fuente y posición (espaciado externo
 * arriba/abajo), en vez de fondo/padding/bordes.
 *
 * A diferencia de ContainerStyleTrigger.tsx (que busca su contenedor más
 * cercano marcado con `data-style-box` vía `closest`, porque se usa desde
 * muchos bloques distintos sin acceso directo al DOM del contenedor), acá
 * `onChange` lo arma EditableText.tsx directamente con su propio `ref` al
 * elemento de texto — no hace falta buscarlo por atributo.
 */
export function TextStyleTrigger({
  label,
  value,
  supports,
  onChange,
  onSave,
}: {
  label: string;
  value: ContainerStyle;
  supports: StyleSupports;
  /** Aplica el cambio visualmente al instante (antes de que termine de guardar). */
  onChange: (style: ContainerStyle) => void;
  /** Persiste el valor final. */
  onSave: (style: ContainerStyle) => Promise<{ error?: string } | void>;
}) {
  const { isAdmin, editMode } = useEditMode();
  const { open } = useStyleEditor();

  if (!isAdmin || !editMode) return null;

  return (
    <button
      type="button"
      onClick={() => open({ label, value, supports, onChange, onSave })}
      title={`Tamaño y posición — ${label}`}
      style={{
        position: "absolute",
        bottom: -14,
        left: -14,
        zIndex: 40,
        width: 22,
        height: 22,
        borderRadius: 999,
        border: "2px solid white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
        background: "#0f172a",
        color: "white",
        fontSize: 10,
        fontWeight: 700,
        lineHeight: "18px",
        cursor: "pointer",
      }}
    >
      Aa
    </button>
  );
}
