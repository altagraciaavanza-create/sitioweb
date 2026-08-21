"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { pages, pageBlocks } from "@/db/schema";
import { blockRegistrySchema, validateBlockContent, type BlockType } from "@/db/blocks";
import { blockDefaults } from "@/db/block-defaults";

function requireDb() {
  if (!isDbConfigured) {
    throw new Error("La base de datos no está configurada todavía (falta DATABASE_URL).");
  }
}

function revalidatePageBySlug(slug: string) {
  revalidatePath(slug === "" ? "/" : `/${slug}`);
  revalidatePath("/admin/pages");
}

// ---------------------------------------------------------------------------
// Páginas
// ---------------------------------------------------------------------------

const pageSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, "Usá solo minúsculas, números y guiones (vacío = home)"),
  title: z.string().min(1, "El título es obligatorio"),
  metaDescription: z.string().optional(),
});

export type PageFormState = { error?: string };

export async function createPage(
  _prevState: PageFormState,
  formData: FormData
): Promise<PageFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = pageSchema.safeParse({
    slug: (formData.get("slug") as string)?.trim() ?? "",
    title: formData.get("title"),
    metaDescription: formData.get("metaDescription") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  let newPageId: string;
  try {
    const [created] = await db
      .insert(pages)
      .values({ ...parsed.data, status: "draft" })
      .returning({ id: pages.id });
    newPageId = created.id;
  } catch {
    return { error: "Ya existe una página con ese slug." };
  }

  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${newPageId}`);
}

export async function updatePageMeta(id: string, formData: FormData) {
  requireDb();
  const parsed = pageSchema.safeParse({
    slug: (formData.get("slug") as string)?.trim() ?? "",
    title: formData.get("title"),
    metaDescription: formData.get("metaDescription") || undefined,
  });
  if (!parsed.success) return;

  await db.update(pages).set({ ...parsed.data, updatedAt: new Date() }).where(eq(pages.id, id));
  revalidatePageBySlug(parsed.data.slug);
  revalidatePath(`/admin/pages/${id}`);
}

export async function togglePageStatus(id: string, slug: string, status: "draft" | "published") {
  requireDb();
  await db.update(pages).set({ status, updatedAt: new Date() }).where(eq(pages.id, id));
  revalidatePageBySlug(slug);
  revalidatePath(`/admin/pages/${id}`);
}

export async function deletePage(id: string, slug: string) {
  requireDb();
  await db.delete(pages).where(eq(pages.id, id));
  revalidatePageBySlug(slug);
}

// ---------------------------------------------------------------------------
// Bloques
// ---------------------------------------------------------------------------

export async function addBlock(pageId: string, slug: string, type: BlockType) {
  requireDb();
  if (!(type in blockRegistrySchema)) return;

  const existing = await db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, pageId));

  await db.insert(pageBlocks).values({
    pageId,
    type,
    order: existing.length,
    content: blockDefaults[type],
  });

  revalidatePageBySlug(slug);
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function deleteBlock(pageId: string, slug: string, blockId: string) {
  requireDb();
  await db.delete(pageBlocks).where(eq(pageBlocks.id, blockId));
  revalidatePageBySlug(slug);
  revalidatePath(`/admin/pages/${pageId}`);
}

export async function reorderBlocks(pageId: string, slug: string, orderedIds: string[]) {
  requireDb();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(pageBlocks).set({ order: index }).where(eq(pageBlocks.id, id))
    )
  );
  revalidatePageBySlug(slug);
  revalidatePath(`/admin/pages/${pageId}`);
}

export type BlockFormState = { error?: string; success?: boolean };

export async function updateBlockContent(
  pageId: string,
  slug: string,
  blockId: string,
  type: BlockType,
  _prevState: BlockFormState,
  formData: FormData
): Promise<BlockFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const raw = buildContentFromForm(type, formData);

  try {
    // Mergea sobre el content existente (no lo reemplaza entero): así, un
    // color de texto puesto desde el modo edición en vivo del sitio público
    // (ver src/components/editing/) no se pierde solo por guardar este
    // formulario clásico, que todavía no tiene campos para tocar colores.
    const [existing] = await db.select().from(pageBlocks).where(eq(pageBlocks.id, blockId));
    const merged = { ...(existing?.content as Record<string, unknown> | undefined), ...raw };
    const content = validateBlockContent(type, merged);
    await db
      .update(pageBlocks)
      .set({ content, updatedAt: new Date() })
      .where(eq(pageBlocks.id, blockId));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Contenido inválido." };
  }

  revalidatePageBySlug(slug);
  revalidatePath(`/admin/pages/${pageId}`);
  return { success: true };
}

/** Traduce los campos planos del formulario al shape JSON que espera cada bloque. */
function buildContentFromForm(type: BlockType, formData: FormData): Record<string, unknown> {
  const get = (key: string) => (formData.get(key) as string)?.trim() || undefined;

  switch (type) {
    case "hero": {
      const primaryLabel = get("primaryCtaLabel");
      const primaryHref = get("primaryCtaHref");
      const secondaryLabel = get("secondaryCtaLabel");
      const secondaryHref = get("secondaryCtaHref");
      return {
        eyebrow: get("eyebrow"),
        title: get("title") ?? "",
        description: get("description"),
        primaryCta: primaryLabel && primaryHref ? { label: primaryLabel, href: primaryHref } : undefined,
        secondaryCta:
          secondaryLabel && secondaryHref ? { label: secondaryLabel, href: secondaryHref } : undefined,
      };
    }
    case "rich_text":
      return {
        title: get("title"),
        body: get("body") ?? "",
        align: get("align") ?? "center",
      };
    case "principles": {
      const raw = get("items") ?? "";
      const items = raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [title, description] = line.split("|").map((s) => s?.trim());
          return { title: title ?? "", description: description ?? "" };
        });
      return { title: get("title") ?? "Nuestras convicciones", items };
    }
    case "topic_grid":
      return {
        title: get("title") ?? "Agenda para Alta Gracia",
        description: get("description"),
        source: "all_topics",
      };
    case "article_grid":
      return {
        title: get("title") ?? "Estamos trabajando",
        description: get("description"),
        limit: Number(get("limit") ?? 3),
        ctaLabel: get("ctaLabel"),
        ctaHref: get("ctaHref"),
      };
    case "cta":
      return {
        eyebrow: get("eyebrow"),
        title: get("title") ?? "",
        description: get("description"),
        ctaLabel: get("ctaLabel") ?? "",
        ctaHref: get("ctaHref") ?? "",
      };
    case "team_grid":
      return {
        title: get("title") ?? "Equipo",
        description: get("description"),
      };
    case "image":
      return {
        imageUrl: get("imageUrl") ?? "",
        alt: get("alt") ?? "",
        caption: get("caption"),
      };
    case "empty_state":
      return {
        title: get("title") ?? "",
        description: get("description"),
      };
    case "content_list":
      return {
        title: get("title"),
        description: get("description"),
        contentTypeId: get("contentTypeId") ?? "",
      };
    case "form":
      return {
        title: get("title"),
        description: get("description"),
        formId: get("formId") ?? "",
      };
    default:
      return {};
  }
}
