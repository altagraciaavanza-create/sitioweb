"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { events } from "@/db/schema";

const eventSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  startsAt: z.string().min(1, "La fecha y hora son obligatorias"),
  location: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  published: z.coerce.boolean().default(true),
});

export type EventFormState = { error?: string; success?: boolean };

function requireDb() {
  if (!isDbConfigured) {
    throw new Error("La base de datos no está configurada todavía (falta DATABASE_URL).");
  }
}

function parseForm(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    startsAt: formData.get("startsAt"),
    location: formData.get("location") || undefined,
    ctaLabel: formData.get("ctaLabel") || undefined,
    ctaHref: formData.get("ctaHref") || undefined,
    published: formData.get("published") === "on",
  });
}

export async function createEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const { startsAt, ...rest } = parsed.data;
  await db.insert(events).values({ ...rest, startsAt: new Date(startsAt) });

  revalidatePath("/agenda");
  revalidatePath("/admin/events");
  return { success: true };
}

export async function updateEvent(
  id: string,
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const { startsAt, ...rest } = parsed.data;
  await db.update(events).set({ ...rest, startsAt: new Date(startsAt) }).where(eq(events.id, id));

  revalidatePath("/agenda");
  revalidatePath("/admin/events");
  return { success: true };
}

export async function deleteEvent(id: string) {
  requireDb();
  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/agenda");
  revalidatePath("/admin/events");
}
