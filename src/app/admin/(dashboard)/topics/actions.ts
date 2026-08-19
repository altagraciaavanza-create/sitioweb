"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { topics } from "@/db/schema";

const topicSchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9-]+$/, "Usá solo minúsculas, números y guiones"),
  title: z.string().min(1, "El título es obligatorio"),
  summary: z.string().min(1, "El resumen es obligatorio"),
  problem: z.string().optional(),
  diagnosis: z.string().optional(),
  proposal: z.string().optional(),
  expectedImpact: z.string().optional(),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

export type TopicFormState = { error?: string };

function requireDb() {
  if (!isDbConfigured) {
    throw new Error("La base de datos no está configurada todavía (falta DATABASE_URL).");
  }
}

function parseForm(formData: FormData) {
  return topicSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    problem: formData.get("problem") || undefined,
    diagnosis: formData.get("diagnosis") || undefined,
    proposal: formData.get("proposal") || undefined,
    expectedImpact: formData.get("expectedImpact") || undefined,
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });
}

export async function createTopic(
  _prevState: TopicFormState,
  formData: FormData
): Promise<TopicFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  try {
    await db.insert(topics).values(parsed.data);
  } catch {
    return { error: "Ya existe un eje temático con ese slug." };
  }

  revalidatePath("/ideas");
  revalidatePath("/admin/topics");
  redirect("/admin/topics");
}

export async function updateTopic(
  id: string,
  _prevState: TopicFormState,
  formData: FormData
): Promise<TopicFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await db.update(topics).set(parsed.data).where(eq(topics.id, id));
  revalidatePath("/ideas");
  revalidatePath(`/ideas/${parsed.data.slug}`);
  revalidatePath("/admin/topics");
  redirect("/admin/topics");
}

export async function deleteTopic(id: string) {
  requireDb();
  await db.delete(topics).where(eq(topics.id, id));
  revalidatePath("/ideas");
  revalidatePath("/admin/topics");
}
