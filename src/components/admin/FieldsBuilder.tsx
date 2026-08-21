"use client";

import { useState } from "react";
import { AdminButton, AdminInput } from "./admin-ui";
import { slugifyKey, fieldTypeLabels, fieldTypeValues, type FieldDef, type FieldType } from "@/db/fields";

/**
 * Constructor de campos reutilizable para "Tipos de contenido" y
 * "Formularios". Guarda el array de campos como JSON en un input oculto
 * llamado "fields", que viaja junto al resto del <form> que lo envuelve.
 */
export function FieldsBuilder({ initialFields }: { initialFields: FieldDef[] }) {
  const [fields, setFields] = useState<FieldDef[]>(initialFields);

  function update(index: number, patch: Partial<FieldDef>) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function addField() {
    setFields((prev) => [
      ...prev,
      { key: `campo_${prev.length + 1}`, label: "", type: "text", required: false },
    ]);
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="fields" value={JSON.stringify(fields)} />

      {fields.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-fg-muted">
          Todavía no agregaste ningún campo.
        </p>
      ) : null}

      {fields.map((field, index) => (
        <div key={index} className="rounded-md border border-border p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-fg-muted">Etiqueta</label>
              <AdminInput
                value={field.label}
                onChange={(e) => {
                  const label = e.target.value;
                  const autoKey = !field.key || field.key.startsWith("campo_");
                  update(index, {
                    label,
                    key: autoKey ? slugifyKey(label) || field.key : field.key,
                  });
                }}
                placeholder='Ej: "Título"'
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-fg-muted">Tipo de dato</label>
              <select
                value={field.type}
                onChange={(e) => update(index, { type: e.target.value as FieldType })}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
              >
                {fieldTypeValues.map((t) => (
                  <option key={t} value={t}>
                    {fieldTypeLabels[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {field.type === "select" ? (
            <div className="mt-3">
              <label className="block text-xs font-medium text-fg-muted">Opciones (una por línea)</label>
              <textarea
                value={(field.options ?? []).join("\n")}
                onChange={(e) =>
                  update(index, {
                    options: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                rows={3}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-fg">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => update(index, { required: e.target.checked })}
                className="h-4 w-4 rounded border-border"
              />
              Obligatorio
            </label>
            <button
              type="button"
              onClick={() => removeField(index)}
              className="text-sm text-red-600 hover:underline"
            >
              Quitar campo
            </button>
          </div>
        </div>
      ))}

      <AdminButton type="button" variant="secondary" onClick={addField}>
        + Agregar campo
      </AdminButton>
    </div>
  );
}
