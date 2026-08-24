"use client";

import { useRef, useState, useTransition, type ElementType, type CSSProperties, type KeyboardEvent } from "react";
import { useEditMode } from "./EditModeContext";
import { updateBlockField } from "@/app/actions/editable-blocks";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { LineBreakTrigger } from "./LineBreakTrigger";
import { TextStyleTrigger } from "./TextStyleTrigger";
import type { StyleSupports } from "./StyleEditorContext";
import type { ContainerStyle } from "@/db/blocks";

/**
 * Texto editable en vivo sobre el sitio público — el corazón del "modo
 * edición" (ver EditModeContext.tsx). Fuera de modo edición (la inmensa
 * mayoría de las visitas) renderiza exactamente un `<Tag>{value}</Tag>`
 * plano, sin costo ni marcado extra: el doble clic para editar y el
 * selector de color solo existen cuando un admin activó el modo edición.
 *
 * `field`/`colorField` son las claves que se actualizan al guardar. Por
 * default persiste `{ [field]: valor }` sobre el `content` JSON del bloque
 * (`blockId`) vía la server action `updateBlockField` — sirve para
 * cualquier campo de texto a nivel de bloque (título, bajada, etc).
 *
 * Para textos que NO viven en el `content` de un bloque — un ítem suelto
 * dentro de un array (ver PrinciplesBlock.tsx), o una fila de otra tabla
 * como `topics`/`posts` (ver SortableTopicGrid.tsx) — se puede pasar
 * `onSave` para reemplazar ese guardado default por cualquier server
 * action que reciba el mismo `patch`.
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
  lineBreakEditable = false,
  sizeField,
  sizeValue,
  sizeSupports,
  onSave,
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
  /**
   * Suma el control de "dónde se corta la línea" (ver LineBreakTrigger.tsx):
   * arrastrar un quiebre entre dos palabras para armar 1, 2 o más líneas a
   * propósito, en vez de depender solo del wrap automático del navegador.
   * Pensado para títulos cortos (el Hero, por ejemplo), no para párrafos.
   */
  lineBreakEditable?: boolean;
  /**
   * Suma el ícono "Aa" (ver TextStyleTrigger.tsx) para tocar el tamaño de
   * fuente y la posición (espaciado externo) de este texto puntual. Los
   * tres se pasan juntos: el campo donde persiste (`sizeField`, ej.
   * "titleStyle"), su valor actual, y qué controles mostrar.
   */
  sizeField?: string;
  sizeValue?: ContainerStyle | null;
  sizeSupports?: StyleSupports;
  /** Reemplaza el guardado default (`updateBlockField(blockId, patch)`). */
  onSave?: (patch: Record<string, unknown>) => Promise<{ error?: string } | void>;
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
  const sizeEditable = Boolean(sizeField);

  const sizeStyle: CSSProperties = sizeValue
    ? {
        fontSize: sizeValue.fontSize != null ? `${sizeValue.fontSize}px` : undefined,
        marginTop: sizeValue.marginTop != null ? `${sizeValue.marginTop}px` : undefined,
        marginBottom: sizeValue.marginBottom != null ? `${sizeValue.marginBottom}px` : undefined,
      }
    : {};
  const mergedStyle = {
    ...(lineBreakEditable ? { whiteSpace: "pre-line" as const } : null),
    ...style,
    ...sizeStyle,
  };

  if (!isAdmin || !editMode) {
    return (
      <Tag className={className} style={mergedStyle}>
        {value}
      </Tag>
    );
  }

  function save(patch: Record<string, unknown>) {
    startTransition(async () => {
      const result = (await (onSave ? onSave(patch) : updateBlockField(blockId, patch))) ?? {};
      if (result.error) {
        toast({ variant: "danger", title: "No se pudo guardar", description: result.error });
      }
    });
  }

  function saveLineBreaks(newText: string) {
    lastSaved.current = newText;
    setText(newText);
    if (ref.current) ref.current.textContent = newText;
    return onSave ? onSave({ [field]: newText }) : updateBlockField(blockId, { [field]: newText });
  }

  function applyTextStyleLocal(next: ContainerStyle) {
    if (!ref.current) return;
    ref.current.style.fontSize = next.fontSize != null ? `${next.fontSize}px` : "";
    ref.current.style.marginTop = next.marginTop != null ? `${next.marginTop}px` : "";
    ref.current.style.marginBottom = next.marginBottom != null ? `${next.marginBottom}px` : "";
  }

  function saveTextStyle(next: ContainerStyle) {
    if (!sizeField) return Promise.resolve({});
    return onSave ? onSave({ [sizeField]: next }) : updateBlockField(blockId, { [sizeField]: next });
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
        style={mergedStyle}
        contentEditable
        suppressContentEditableWarning
        onDoubleClick={() => setIsEditing(true)}
        onFocus={() => setIsEditing(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {text}
      </Tag>

      {lineBreakEditable ? (
        <LineBreakTrigger label="Ajustar líneas" value={text} onSave={saveLineBreaks} />
      ) : null}

      {sizeEditable ? (
        <TextStyleTrigger
          label="Tamaño y posición del texto"
          value={sizeValue ?? {}}
          supports={sizeSupports ?? { fontSize: true, margin: true }}
          onChange={applyTextStyleLocal}
          onSave={saveTextStyle}
        />
      ) : null}

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
