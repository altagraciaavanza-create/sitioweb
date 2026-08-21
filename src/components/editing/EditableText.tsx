"use client";

import { useRef, useState, useTransition, type ElementType, type CSSProperties, type KeyboardEvent } from "react";
import { useEditMode } from "./EditModeContext";
import { updateBlockField } from "@/app/actions/editable-blocks";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

/**
 * Texto editable en vivo sobre el sitio público — el corazón del "modo
 * edición" (ver EditModeContext.tsx). Fuera de modo edición (la inmensa
 * mayoría de las visitas) renderiza exactamente un `<Tag>{value}</Tag>`
 * plano, sin costo ni marcado extra: el doble clic para editar y el
 * selector de color solo existen cuando un admin activó el modo edición.
 *
 * `field`/`colorField` son las claves del `content` JSON del bloque (ver
 * src/db/blocks.ts) que se actualizan al guardar — este componente no sabe
 * nada del tipo de bloque, solo persiste `{ [field]: valor }` vía la server
 * action `updateBlockField`.
 */
export function EditableText({
  blockId,
  field,
  value,
  as: Tag = "p",
  className,
  colorField,
  colorValue,
  style,
  multiline = false,
}: {
  blockId: string;
  field: string;
  value: string;
  as?: ElementType;
  className?: string;
  colorField?: string;
  colorValue?: string | null;
  style?: CSSProperties;
  multiline?: boolean;
}) {
  const { isAdmin, editMode } = useEditMode();
  const [text, setText] = useState(value);
  const [color, setColor] = useState(colorValue ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [, startTransition] = useTransition();
  const { toast } = useToast();
  const ref = useRef<HTMLElement>(null);
  const lastSaved = useRef(value);

  if (!isAdmin || !editMode) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  function save(patch: Record<string, unknown>) {
    startTransition(async () => {
      const result = await updateBlockField(blockId, patch);
      if (result.error) {
        toast({ variant: "danger", title: "No se pudo guardar", description: result.error });
      }
    });
  }

  function handleBlur() {
    setIsEditing(false);
    const newText = ref.current?.textContent?.trim() ?? "";
    if (newText && newText !== lastSaved.current) {
      lastSaved.current = newText;
      setText(newText);
      save({ [field]: newText });
    } else if (ref.current) {
      ref.current.textContent = lastSaved.current;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      if (ref.current) ref.current.textContent = lastSaved.current;
      ref.current?.blur();
    } else if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      ref.current?.blur();
    }
  }

  return (
    <span style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <Tag
        ref={ref as never}
        className={cn(
          className,
          "rounded outline-offset-2",
          isEditing ? "outline outline-2 outline-brand-500" : "cursor-text outline outline-1 outline-dashed outline-brand-300/60"
        )}
        style={style}
        contentEditable
        suppressContentEditableWarning
        onDoubleClick={() => setIsEditing(true)}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {text}
      </Tag>

      {colorField ? (
        <span style={{ position: "absolute", top: -14, right: -14 }}>
          <button
            type="button"
            onClick={() => setShowColorPicker((v) => !v)}
            title="Color de este texto"
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              border: "2px solid white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
              background: color || "#94a3b8",
              cursor: "pointer",
            }}
          />
          {showColorPicker ? (
            <span
              style={{
                position: "absolute",
                top: 26,
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
                  save({ [colorField]: hex });
                }}
                style={{ width: 28, height: 28, border: "none", padding: 0, background: "none" }}
              />
              {color ? (
                <button
                  type="button"
                  onClick={() => {
                    setColor("");
                    save({ [colorField]: undefined });
                    setShowColorPicker(false);
                  }}
                  style={{ fontSize: 11, color: "#64748b" }}
                >
                  Quitar
                </button>
              ) : null}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
