"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { brandThemes, siteSettings } from "@/db/schema";
import { uploadImage } from "@/lib/storage";
import {
  themeColorsSchema,
  themeFontFamilyValues,
  themeDesignSchema,
  type ThemeColors,
  type ThemeFontFamily,
  type ThemeDesign,
} from "@/db/theme";
import { z } from "zod";

function requireDb() {
  if (!isDbConfigured) {
    throw new Error("La base de datos no está configurada todavía (falta DATABASE_URL).");
  }
}

const themeInputSchema = z.object({
  name: z.string().min(1, "Ponele un nombre al perfil."),
  colors: themeColorsSchema,
  fontFamily: z.enum(themeFontFamilyValues),
}).merge(themeDesignSchema);

export type ThemeInput = {
  name: string;
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
} & ThemeDesign;

export type ThemeActionState = { error?: string; success?: boolean };

export async function createTheme(input: ThemeInput): Promise<ThemeActionState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = themeInputSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await db.insert(brandThemes).values(parsed.data);
  revalidatePath("/admin/identidad");
  return { success: true };
}

export async function updateTheme(id: string, input: ThemeInput): Promise<ThemeActionState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = themeInputSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  await db
    .update(brandThemes)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(brandThemes.id, id));

  revalidatePath("/admin/identidad");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteTheme(id: string) {
  requireDb();
  await db.delete(brandThemes).where(eq(brandThemes.id, id));
  revalidatePath("/admin/identidad");
  revalidatePath("/", "layout");
}

export type UploadLogoState = { url?: string; error?: string };

/** Sube el logo de un perfil a Supabase Storage y devuelve su URL pública. */
export async function uploadThemeLogo(formData: FormData): Promise<UploadLogoState> {
  try {
    requireDb();
    const file = formData.get("logo");
    if (!(file instanceof File)) {
      return { error: "No se recibió ningún archivo." };
    }
    const url = await uploadImage(file, "brand-logos");
    if (!url) return { error: "No se pudo subir el logo." };
    return { url };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/** Aplica un perfil al sitio público, o lo quita (id = null → diseño original). */
export async function applyTheme(id: string | null) {
  requireDb();
  await db
    .insert(siteSettings)
    .values({ id: 1, activeBrandThemeId: id, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: { activeBrandThemeId: id, updatedAt: new Date() },
    });
  revalidatePath("/admin/identidad");
  revalidatePath("/", "layout");
}
