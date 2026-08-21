"use server";

import { z } from "zod";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import { fieldDefsSchema, slugifyKey, type FieldDef } from "@/db/fields";

function requireDb() {
  if (!isDbConfigured) {
    throw new Error("La base de datos no está configurada todavía (falta DATABASE_URL).");
  }
}

const formDefSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9-]+$/, "Usá solo minúsculas, números y guiones"),
  description: z.string().optional(),
  successMessage: z.string().min(1, "El mensaje de éxito es obligatorio"),
});

function dedupeFieldKeys(fields: FieldDef[]): FieldDef[] {
  const seen = new Map<string, number>();
  return fields.map((f) => {
    let key = f.key || slugifyKey(f.label) || "campo";
    const count = seen.get(key) ?? 0;
    seen.set(key, count + 1);
    if (count > 0) key = `${key}_${count + 1}`;
    return { ...f, key };
  });
}

function parseFields(formData: FormData): FieldDef[] {
  const raw = formData.get("fields");
  let parsed: unknown = [];
  try {
    parsed = raw ? JSON.parse(raw as string) : [];
  } catch {
    parsed = [];
  }
  const result = fieldDefsSchema.safeParse(parsed);
  if (!result.success) return [];
  return dedupeFieldKeys(result.data.filter((f) => f.label.trim().length > 0));
}

export type FormDefFormState = { error?: string; success?: boolean };

export async function createForm(
  _prevState: FormDefFormState,
  formData: FormData
): Promise<FormDefFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const fields = parseFields(formData);
  const name = (formData.get("name") as string) ?? "";
  const parsed = formDefSchema.safeParse({
    name,
    slug: ((formData.get("slug") as string) || slugifyKey(name)).replace(/_/g, "-"),
    description: formData.get("description") || undefined,
    successMessage: (formData.get("successMessage") as string) || "¡Gracias! Recibimos tu envío.",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  if (fields.length === 0) return { error: "Agregá al menos un campo." };

  try {
    await db.insert(forms).values({ ...parsed.data, fields });
  } catch (e) {
    return {
      error: /unique/i.test((e as Error).message)
        ? "Ya existe un formulario con ese slug."
        : "No se pudo crear el formulario.",
    };
  }

  revalidatePath("/admin/forms");
  return { success: true };
}

export async function updateForm(
  id: string,
  _prevState: FormDefFormState,
  formData: FormData
): Promise<FormDefFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const fields = parseFields(formData);
  const parsed = formDefSchema.safeParse({
    name: formData.get("name"),
    slug: (formData.get("slug") as string)?.replace(/_/g, "-"),
    description: formData.get("description") || undefined,
    successMessage: (formData.get("successMessage") as string) || "¡Gracias! Recibimos tu envío.",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  if (fields.length === 0) return { error: "Agregá al menos un campo." };

  try {
    await db
      .update(forms)
      .set({ ...parsed.data, fields, updatedAt: new Date() })
      .where(eq(forms.id, id));
  } catch (e) {
    return {
      error: /unique/i.test((e as Error).message)
        ? "Ya existe un formulario con ese slug."
        : "No se pudo guardar.",
    };
  }

  revalidatePath("/admin/forms");
  return { success: true };
}

export async function deleteForm(id: string) {
  requireDb();
  await db.delete(forms).where(eq(forms.id, id));
  revalidatePath("/admin/forms");
}

export async function deleteFormSubmission(formId: string, submissionId: string) {
  requireDb();
  await db.delete(formSubmissions).where(eq(formSubmissions.id, submissionId));
  revalidatePath(`/admin/forms/${formId}/submissions`);
  revalidatePath("/admin/forms");
}

export async function markSubmissionRead(formId: string, submissionId: string) {
  requireDb();
  await db
    .update(formSubmissions)
    .set({ readAt: new Date() })
    .where(eq(formSubmissions.id, submissionId));
  revalidatePath(`/admin/forms/${formId}/submissions`);
  revalidatePath("/admin/forms");
}

export async function markAllSubmissionsRead(formId: string) {
  requireDb();
  await db
    .update(formSubmissions)
    .set({ readAt: new Date() })
    .where(and(eq(formSubmissions.formId, formId), isNull(formSubmissions.readAt)));
  revalidatePath(`/admin/forms/${formId}/submissions`);
  revalidatePath("/admin/forms");
}
