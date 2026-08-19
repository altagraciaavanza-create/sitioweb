"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { siteSettings } from "@/db/schema";

const settingsSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  contactEmail: z.string().optional(),
  whatsappNumber: z.string().optional(),
  whatsappMessage: z.string().optional(),
  instagramUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  ogImageUrl: z.string().optional(),
});

export type SettingsFormState = { error?: string; success?: boolean };

export async function updateSiteSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  if (!isDbConfigured) {
    return { error: "La base de datos no está configurada todavía (falta DATABASE_URL)." };
  }

  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    tagline: formData.get("tagline") || undefined,
    description: formData.get("description") || undefined,
    contactEmail: formData.get("contactEmail") || undefined,
    whatsappNumber: formData.get("whatsappNumber") || undefined,
    whatsappMessage: formData.get("whatsappMessage") || undefined,
    instagramUrl: formData.get("instagramUrl") || undefined,
    facebookUrl: formData.get("facebookUrl") || undefined,
    twitterUrl: formData.get("twitterUrl") || undefined,
    tiktokUrl: formData.get("tiktokUrl") || undefined,
    youtubeUrl: formData.get("youtubeUrl") || undefined,
    ogImageUrl: formData.get("ogImageUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await db
    .insert(siteSettings)
    .values({ id: 1, ...parsed.data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { ...parsed.data, updatedAt: new Date() },
    });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { success: true };
}
