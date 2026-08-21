"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { contentTypes, contentEntries } from "@/db/schema";
import { fieldDefsSchema, slugifyKey, validateEntryData, type FieldDef } from "@/db/fields";

function requireDb() {
  if (!isDbConfigured) {
    throw new Error("La base de datos no está configurada todavía (falta DATABASE_URL).");
  }
}

const typeSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  namePlural: z.string().min(1, "El nombre plural es obligatorio"),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9-]+$/, "Usá solo minúsculas, números y guiones"),
  description: z.string().optional(),
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

// ---------------------------------------------------------------------------
// Tipos de contenido
// ---------------------------------------------------------------------------

export type ContentTypeFormState = { error?: string; success?: boolean };

export async function createContentType(
  _prevState: ContentTypeFormState,
  formData: FormData
): Promise<ContentTypeFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const fields = parseFields(formData);
  const name = (formData.get("name") as string) ?? "";
  const parsed = typeSchema.safeParse({
    name,
    namePlural: formData.get("namePlural"),
    slug: ((formData.get("slug") as string) || slugifyKey(name)).replace(/_/g, "-"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  if (fields.length === 0) return { error: "Agregá al menos un campo." };

  try {
    await db.insert(contentTypes).values({ ...parsed.data, fields });
  } catch (e) {
    return {
      error: /unique/i.test((e as Error).message)
        ? "Ya existe un tipo de contenido con ese slug."
        : "No se pudo crear el tipo de contenido.",
    };
  }

  revalidatePath("/admin/content-types");
  return { success: true };
}

export async function updateContentType(
  id: string,
  _prevState: ContentTypeFormState,
  formData: FormData
): Promise<ContentTypeFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const fields = parseFields(formData);
  const parsed = typeSchema.safeParse({
    name: formData.get("name"),
    namePlural: formData.get("namePlural"),
    slug: (formData.get("slug") as string)?.replace(/_/g, "-"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  if (fields.length === 0) return { error: "Agregá al menos un campo." };

  try {
    await db
      .update(contentTypes)
      .set({ ...parsed.data, fields, updatedAt: new Date() })
      .where(eq(contentTypes.id, id));
  } catch (e) {
    return {
      error: /unique/i.test((e as Error).message)
        ? "Ya existe un tipo de contenido con ese slug."
        : "No se pudo guardar.",
    };
  }

  revalidatePath("/admin/content-types");
  revalidatePath(`/admin/content-types/${id}`);
  return { success: true };
}

export async function deleteContentType(id: string) {
  requireDb();
  await db.delete(contentTypes).where(eq(contentTypes.id, id));
  revalidatePath("/admin/content-types");
}

// ---------------------------------------------------------------------------
// Entradas
// ---------------------------------------------------------------------------

export type EntryFormState = { error?: string; success?: boolean };

export async function createEntry(
  contentTypeId: string,
  _prevState: EntryFormState,
  formData: FormData
): Promise<EntryFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const [type] = await db.select().from(contentTypes).where(eq(contentTypes.id, contentTypeId));
  if (!type) return { error: "Tipo de contenido no encontrado." };

  const { data, error } = validateEntryData(type.fields as FieldDef[], formData);
  if (error) return { error };

  await db.insert(contentEntries).values({
    contentTypeId,
    data,
    order: Number(formData.get("order") || 0),
    published: formData.get("published") === "on",
  });

  revalidatePath("/");
  revalidatePath(`/admin/content-types/${contentTypeId}/entries`);
  return { success: true };
}

export async function updateEntry(
  contentTypeId: string,
  entryId: string,
  _prevState: EntryFormState,
  formData: FormData
): Promise<EntryFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const [type] = await db.select().from(contentTypes).where(eq(contentTypes.id, contentTypeId));
  if (!type) return { error: "Tipo de contenido no encontrado." };

  const { data, error } = validateEntryData(type.fields as FieldDef[], formData);
  if (error) return { error };

  await db
    .update(contentEntries)
    .set({
      data,
      order: Number(formData.get("order") || 0),
      published: formData.get("published") === "on",
      updatedAt: new Date(),
    })
    .where(eq(contentEntries.id, entryId));

  revalidatePath("/");
  revalidatePath(`/admin/content-types/${contentTypeId}/entries`);
  return { success: true };
}

export async function deleteEntry(contentTypeId: string, entryId: string) {
  requireDb();
  await db.delete(contentEntries).where(eq(contentEntries.id, entryId));
  revalidatePath("/");
  revalidatePath(`/admin/content-types/${contentTypeId}/entries`);
}
