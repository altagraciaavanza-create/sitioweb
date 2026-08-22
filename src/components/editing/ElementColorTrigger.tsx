"use client";

import { useState, useTransition } from "react";
import { useEditMode } from "./EditModeContext";
import { useToast } from "@/components/ui/Toast";

/**
 * Círculo de color que, en modo edición en vivo, permite tocar el color de
 * un elemento SUELTO dentro de una tarjeta/sección — un ícono, un botón —
 * a diferencia de ContainerStyleTrigger.tsx (que estiliza el contenedor
 * entero). Mismo patrón visual que el selector de color de EditableText.tsx,
 * pero reutilizable para cualquier elemento (no solo texto).
 *
 * Se espera un `<span style={{position:"relative"}}>` (o similar) como
 * ancestro inmediato del elemento a colorear, para que el círculo se
 * posicione relativo a ÉL y no a toda la tarjeta.
 */
export function ElementColorTrigger({
  label,
  value,
  onSave,
}: {
  /** Título del popover, ej: "Color del ícono". */
  label: string;
  value?: string | null;
  onSave: (color: string | undefined) => Promise<{ error?: string } | void>;
}) {
  const { isAdmin, editMode } = useEditMode();
  const [color, setColor] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { toast } = useToast();

  if (!isAdmin || !editMode) return null;

  function save(hex: string | undefined) {
    startTransition(async () => {
      const result = (await onSave(hex)) ?? {};
      if (result.error) {
        toast({ variant: "danger", title: "No se pudo guardar", description: result.error });
      }
    });
  }

  return (
    <span style={{ position: "absolute", top: -10, right: -10, zIndex: 40 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={label}
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          border: "2px solid white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
          background: color || "#94a3b8",
          cursor: "pointer",
        }}
      />
      {open ? (
        <span
          style={{
            position: "absolute",
            top: 24,
            right: 0,
            background: "white",
            borderRadius: 8,
            padding: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            zIndex: 50,
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="color"
            value={color || "#000000"}
            onChange={(e) => {
              const hex = e.target.value;
              setColor(hex);
              save(hex);
            }}
            style={{ width: 28, height: 28, border: "none", padding: 0, background: "none" }}
          />
          {color ? (
            <button
              type="button"
              onClick={() => {
                setColor("");
                save(undefined);
                setOpen(false);
              }}
              style={{ fontSize: 11, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            >
              Quitar
            </button>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
