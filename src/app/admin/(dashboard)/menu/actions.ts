"use server";

import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { navItems, navLocationEnum } from "@/db/schema";

const navItemSchema = z.object({
  location: z.enum(navLocationEnum.enumValues),
  label: z.string().min(1, "La etiqueta es obligatoria"),
  href: z.string().min(1, "El link es obligatorio"),
  openInNewTab: z.coerce.boolean().default(false),
});

function requireDb() {
  if (!isDbConfigured) {
    throw new Error("La base de datos no está configurada todavía (falta DATABASE_URL).");
  }
}

export async function createNavItem(formData: FormData) {
  requireDb();
  const parsed = navItemSchema.safeParse({
    location: formData.get("location"),
    label: formData.get("label"),
    href: formData.get("href"),
    openInNewTab: formData.get("openInNewTab") === "on",
  });
  if (!parsed.success) return;

  const existing = await db
    .select()
    .from(navItems)
    .where(eq(navItems.location, parsed.data.location));
  const nextOrder = existing.length;

  await db.insert(navItems).values({ ...parsed.data, order: nextOrder });
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
}

export async function deleteNavItem(id: string) {
  requireDb();
  await db.delete(navItems).where(eq(navItems.id, id));
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
}

export async function updateNavItemLabelHref(id: string, formData: FormData) {
  requireDb();
  const label = String(formData.get("label") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  if (!label || !href) return;

  await db.update(navItems).set({ label, href }).where(eq(navItems.id, id));
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
}

export async function moveNavItem(id: string, direction: "up" | "down") {
  requireDb();
  const [item] = await db.select().from(navItems).where(eq(navItems.id, id));
  if (!item) return;

  const siblings = await db
    .select()
    .from(navItems)
    .where(eq(navItems.location, item.location))
    .orderBy(asc(navItems.order));

  const index = siblings.findIndex((s) => s.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) return;

  const swapWith = siblings[swapIndex];

  await db.update(navItems).set({ order: swapWith.order }).where(eq(navItems.id, item.id));
  await db.update(navItems).set({ order: item.order }).where(eq(navItems.id, swapWith.id));

  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
}
