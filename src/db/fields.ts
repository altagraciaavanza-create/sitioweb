import { z } from "zod";

/**
 * Definición de campos reutilizable para "Tipos de contenido" (verticales
 * genéricas administrables) y "Formularios" (capturan envíos de vecinos).
 *
 * Los campos de cada tipo/formulario se guardan como JSON (`fields`), y los
 * datos de cada entrada/envío también se guardan como JSON (`data`), con
 * las keys de `fields` como claves. Así, crear una vertical o un formulario
 * nuevo no requiere ninguna migración de base de datos.
 */

export const fieldTypeValues = [
  "text",
  "textarea",
  "number",
  "date",
  "boolean",
  "select",
  "email",
  "url",
  "image",
] as const;

export type FieldType = (typeof fieldTypeValues)[number];

export const fieldTypeLabels: Record<FieldType, string> = {
  text: "Texto corto",
  textarea: "Texto largo",
  number: "Número",
  date: "Fecha",
  boolean: "Sí / No",
  select: "Selección (opciones)",
  email: "Email",
  url: "URL",
  image: "Imagen (URL)",
};

export const fieldDefSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(fieldTypeValues),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

export type FieldDef = z.infer<typeof fieldDefSchema>;

export const fieldDefsSchema = z.array(fieldDefSchema).default([]);

/** Genera una key en snake_case a partir de un label (para autogenerar keys). */
export function slugifyKey(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

/**
 * Valida y arma el objeto `data` de una entrada/envío a partir de un
 * FormData plano, según la lista de campos definida para ese tipo/formulario.
 * Devuelve el primer error de campo obligatorio faltante, si lo hay.
 */
export function validateEntryData(
  fields: FieldDef[],
  formData: FormData
): { data: Record<string, unknown>; error?: string } {
  const data: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "boolean") {
      data[field.key] = formData.get(field.key) === "on";
      continue;
    }

    const raw = formData.get(field.key);
    const value = typeof raw === "string" ? raw.trim() : "";

    if (field.required && !value) {
      return { data, error: `${field.label} es obligatorio.` };
    }

    if (field.type === "number") {
      data[field.key] = value ? Number(value) : null;
    } else {
      data[field.key] = value || null;
    }
  }

  return { data };
}
