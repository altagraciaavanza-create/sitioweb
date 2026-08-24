"use client";

import { Fragment, useState, useTransition } from "react";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from "@dnd-kit/core";
import { useToast } from "@/components/ui/Toast";

/**
 * Control de "dónde se corta la línea" para un texto editable (ver
 * EditableText.tsx, prop `lineBreakEditable`). A diferencia de escribir
 * Enter a mano dentro de un contentEditable (poco confiable: el navegador
 * inserta <div>/<br> que no sobreviven un `textContent` limpio), acá el
 * quiebre de línea es un dato explícito — un carácter `\n` real dentro del
 * string guardado — que se arma arrastrando un "quiebre" reutilizable
 * sobre el espacio entre dos palabras. Se puede poner ninguno (una sola
 * línea), uno, o varios (dos o más líneas).
 *
 * Requiere que el texto se renderice con `white-space: pre-line` para que
 * esos `\n` se vean como saltos de línea reales (ver EditableText.tsx).
 */
export function LineBreakTrigger({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (text: string) => Promise<{ error?: string } | void>;
}) {
  const [open, setOpen] = useState(false);
  const parsed = parseValue(value);
  const [words, setWords] = useState(parsed.words);
  const [breaksAfter, setBreaksAfter] = useState<Set<number>>(parsed.breaksAfter);
  const [, startTransition] = useTransition();
  const { toast } = useToast();

  // Si el texto cambió por fuera (otro admin lo editó, o se guardó desde
  // acá mismo y volvió a bajar por props), resincronizamos la base de
  // palabras — si no, quedaríamos editando sobre una versión vieja.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    const reparsed = parseValue(value);
    setWords(reparsed.words);
    setBreaksAfter(reparsed.breaksAfter);
  }

  function persist(next: Set<number>) {
    setBreaksAfter(next);
    startTransition(async () => {
      const result = (await onSave(buildText(words, next))) ?? {};
      if (result.error) {
        toast({ variant: "danger", title: "No se pudo guardar", description: result.error });
      }
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id !== "palette-break") return;
    const overId = String(over.id);
    if (!overId.startsWith("gap-")) return;
    const idx = Number(overId.slice(4));
    if (breaksAfter.has(idx)) return;
    persist(new Set(breaksAfter).add(idx));
  }

  function removeBreak(idx: number) {
    const next = new Set(breaksAfter);
    next.delete(idx);
    persist(next);
  }

  const previewLines = splitIntoLines(words, breaksAfter);

  return (
    <span style={{ position: "absolute", top: -14, left: -14, zIndex: 40 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={label}
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          border: "2px solid white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
          background: "#0f172a",
          color: "white",
          fontSize: 12,
          lineHeight: "18px",
          cursor: "pointer",
        }}
      >
        ¶
      </button>

      {open ? (
        <div
          style={{
            // Posición FIJA en pantalla (no relativa al texto) a propósito:
            // si colgara del botón, un texto grande (ver TextStyleTrigger.tsx)
            // hace que el propio panel tape el texto que se está editando —
            // pasó en la práctica con el título del Hero a 88px. Mismo
            // criterio que ya usa ContainerStylePanel.tsx (fixed), pero en
            // la esquina opuesta para no chocar con ese panel si los dos
            // están abiertos a la vez.
            position: "fixed",
            bottom: 16,
            left: 16,
            background: "white",
            color: "#0f172a",
            borderRadius: 10,
            padding: 14,
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            width: 340,
            maxWidth: "calc(100vw - 32px)",
            zIndex: 70,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{label}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 13 }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontSize: 11, color: "#64748b", marginBottom: 10, lineHeight: 1.4 }}>
            Arrastrá <strong>⏎ salto de línea</strong> sobre el espacio entre dos palabras para cortar ahí.
            Tocá un quiebre ya puesto para sacarlo. El texto en sí (las palabras) se edita con doble clic,
            como siempre.
          </p>

          <DndContext onDragEnd={handleDragEnd}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <PaletteBreakChip />
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2,
                padding: 8,
                border: "1px dashed #cbd5e1",
                borderRadius: 8,
              }}
            >
              {words.map((w, i) => (
                <Fragment key={i}>
                  <span style={{ padding: "2px 6px", background: "#f1f5f9", borderRadius: 4, fontSize: 13 }}>
                    {w}
                  </span>
                  {i < words.length - 1 ? (
                    <GapSlot index={i} active={breaksAfter.has(i)} onRemove={() => removeBreak(i)} />
                  ) : null}
                </Fragment>
              ))}
            </div>
          </DndContext>

          <div style={{ marginTop: 12 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: 0.4,
                marginBottom: 4,
              }}
            >
              Vista previa ({previewLines.length} {previewLines.length === 1 ? "línea" : "líneas"})
            </p>
            <div style={{ fontSize: 13, lineHeight: 1.3, color: "#0f172a" }}>
              {previewLines.map((line, i) => (
                <div key={i}>{line.join(" ")}</div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </span>
  );
}

function PaletteBreakChip() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: "palette-break" });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      style={{
        ...style,
        cursor: "grab",
        background: "#d97a3f",
        color: "white",
        border: "none",
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 12,
        fontWeight: 700,
        touchAction: "none",
      }}
    >
      ⏎ salto de línea
    </button>
  );
}

function GapSlot({ index, active, onRemove }: { index: number; active: boolean; onRemove: () => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: `gap-${index}` });

  if (active) {
    return (
      <button
        type="button"
        onClick={onRemove}
        title="Sacar este salto de línea"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          background: "#d97a3f",
          color: "white",
          borderRadius: 4,
          border: "none",
          fontSize: 11,
          cursor: "pointer",
        }}
      >
        ⏎
      </button>
    );
  }

  return (
    <span
      ref={setNodeRef}
      style={{
        display: "inline-block",
        width: isOver ? 22 : 8,
        height: 20,
        borderRadius: 4,
        background: isOver ? "#fcd9c0" : "transparent",
        transition: "width 0.1s",
      }}
    />
  );
}

function parseValue(value: string) {
  const rawLines = value.split("\n");
  const words: string[] = [];
  const breaksAfter = new Set<number>();
  rawLines.forEach((line, li) => {
    const lineWords = line.trim().split(/\s+/).filter(Boolean);
    words.push(...lineWords);
    if (li < rawLines.length - 1 && words.length > 0) {
      breaksAfter.add(words.length - 1);
    }
  });
  return { words, breaksAfter };
}

function splitIntoLines(words: string[], breaksAfter: Set<number>) {
  const lines: string[][] = [];
  let current: string[] = [];
  words.forEach((w, i) => {
    current.push(w);
    if (breaksAfter.has(i)) {
      lines.push(current);
      current = [];
    }
  });
  lines.push(current);
  return lines;
}

function buildText(words: string[], breaksAfter: Set<number>) {
  return splitIntoLines(words, breaksAfter)
    .map((line) => line.join(" "))
    .join("\n");
}
