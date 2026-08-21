"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { participationOptions } from "@/db/schema";

const participationSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
  formId: z.string().uuid().nullable(),
});

export type ParticipationFormState = { error?: string; success?: boolean };

function requireDb() {
  if (!isDbConfigured) {
    throw new Error("La base de datos no está configurada todavía (falta DATABASE_URL).");
  }
}

function parseForm(formData: FormData) {
  const formId = (formData.get("formId") as string)?.trim() || null;
  return participationSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
    formId,
  });
}

export async function createParticipationOption(
  _prevState: ParticipationFormState,
  formData: FormData
): Promise<ParticipationFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await db.insert(participationOptions).values(parsed.data);
  revalidatePath("/participa");
  revalidatePath("/admin/participation");
  return { success: true };
}

export async function updateParticipationOption(
  id: string,
  _prevState: ParticipationFormState,
  formData: FormData
): Promise<ParticipationFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await db.update(participationOptions).set(parsed.data).where(eq(participationOptions.id, id));
  revalidatePath("/participa");
  revalidatePath("/admin/participation");
  return { success: true };
}

export async function deleteParticipationOption(id: string) {
  requireDb();
  await db.delete(participationOptions).where(eq(participationOptions.id, id));
  revalidatePath("/participa");
  revalidatePath("/admin/participation");
}
