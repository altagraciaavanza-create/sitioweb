"use client";

import { useState, useTransition } from "react";
import { useStyleEditor, type StyleEditorTarget } from "./StyleEditorContext";
import { useToast } from "@/components/ui/Toast";
import type { ContainerStyle } from "@/db/blocks";

/**
 * Panel flotante único (montado una vez, ver SiteChrome.tsx) que edita el
 * contenedor seleccionado en modo edición en vivo — lo abre cualquier
 * ContainerStyleTrigger.tsx. Cada cambio se aplica al instante (vía
 * `target.onChange`) y se guarda en segundo plano (vía `target.onSave`),
 * igual que el selector de color de EditableText.tsx.
 */
export function ContainerStylePanel() {
  const { target, close } = useStyleEditor();
  const [local, setLocal] = useState<ContainerStyle>(target?.value ?? {});
  const [, startTransition] = useTransition();
  const { toast } = useToast();

  // Nuevo elemento seleccionado (o el mismo reabierto): partimos de su
  // valor guardado, no del que haya quedado de la selección anterior.
  // (Derivado durante el render, no en un efecto — ver SortableBlockList.tsx
  // para el mismo patrón con el orden de bloques.)
  const [lastTarget, setLastTarget] = useState<StyleEditorTarget | null>(target);
  if (target !== lastTarget) {
    setLastTarget(target);
    setLocal(target?.value ?? {});
  }

  if (!target) return null;
  const { label, supports, onChange, onSave } = target;

  function commit(patch: ContainerStyle) {
    const merged = { ...local, ...patch };
    setLocal(merged);
    onChange(merged);
    startTransition(async () => {
      const result = (await onSave(merged)) ?? {};
      if (result.error) {
        toast({ variant: "danger", title: "No se pudo guardar", description: result.error });
      }
    });
  }

  function reset() {
    commit({
      background: undefined,
      padding: undefined,
      radius: undefined,
      width: undefined,
      marginTop: undefined,
      marginBottom: undefined,
    });
  }

  const hasOverride =
    local.background != null ||
    local.padding != null ||
    local.radius != null ||
    local.width != null ||
    local.marginTop != null ||
    local.marginBottom != null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: 16,
        transform: "translateY(-50%)",
        zIndex: 70,
        background: "white",
        color: "#0f172a",
        borderRadius: 14,
        padding: 18,
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        width: 260,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: "#94a3b8", textTransform: "uppercase" }}>
            Estilo
          </div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{label}</div>
        </div>
        <button
          type="button"
          onClick={close}
          title="Cerrar"
          style={{ fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          ✕
        </button>
      </div>

      {supports.background ? (
        <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          Fondo
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="color"
              value={local.background || "#0f172a"}
              onChange={(e) => commit({ background: e.target.value })}
              style={{ width: 32, height: 32, border: "none", padding: 0, background: "none", cursor: "pointer" }}
            />
            <span style={{ color: "#64748b" }}>{local.background ? local.background : "Automático"}</span>
            {local.background ? (
              <button
                type="button"
                onClick={() => commit({ background: undefined })}
                style={{ fontSize: 11, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
              >
                Quitar
              </button>
            ) : null}
          </span>
        </label>
      ) : null}

      {supports.padding ? (
        <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          Espaciado interno — {local.padding != null ? `${local.padding}px` : "automático"}
          <input
            type="range"
            min={0}
            max={supports.paddingMax ?? 160}
            step={2}
            value={local.padding ?? 0}
            onChange={(e) => commit({ padding: Number(e.target.value) })}
          />
        </label>
      ) : null}

      {supports.radius ? (
        <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          Bordes redondeados — {local.radius != null ? `${local.radius}px` : "automático"}
          <input
            type="range"
            min={0}
            max={48}
            step={2}
            value={local.radius ?? 0}
            onChange={(e) => commit({ radius: Number(e.target.value) })}
          />
        </label>
      ) : null}

      {supports.width ? (
        <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          Ancho máximo — {local.width != null ? `${local.width}px` : "automático"}
          <input
            type="range"
            min={80}
            max={supports.widthMax ?? 480}
            step={8}
            value={local.width ?? supports.widthMax ?? 480}
            onChange={(e) => commit({ width: Number(e.target.value) })}
          />
          {local.width != null ? (
            <button
              type="button"
              onClick={() => commit({ width: undefined })}
              style={{ fontSize: 11, color: "#64748b", background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start" }}
            >
              Quitar
            </button>
          ) : null}
        </label>
      ) : null}

      {supports.margin ? (
        <>
          <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            Posición — separación arriba ({local.marginTop != null ? `${local.marginTop}px` : "0px"})
            <input
              type="range"
              min={-100}
              max={200}
              step={4}
              value={local.marginTop ?? 0}
              onChange={(e) => commit({ marginTop: Number(e.target.value) })}
            />
          </label>
          <label style={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            Posición — separación abajo ({local.marginBottom != null ? `${local.marginBottom}px` : "0px"})
            <input
              type="range"
              min={-100}
              max={200}
              step={4}
              value={local.marginBottom ?? 0}
              onChange={(e) => commit({ marginBottom: Number(e.target.value) })}
            />
          </label>
        </>
      ) : null}

      {hasOverride ? (
        <button
          type="button"
          onClick={reset}
          style={{
            fontSize: 12,
            color: "#b91c1c",
            background: "none",
            border: "none",
            cursor: "pointer",
            alignSelf: "flex-start",
            padding: 0,
          }}
        >
          Restablecer todo
        </button>
      ) : null}
    </div>
  );
}
