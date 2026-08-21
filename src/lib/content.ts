import { cache } from "react";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import {
  navItems,
  pages,
  pageBlocks,
  posts,
  siteSettings,
  teamMembers,
  topics,
  events,
  participationOptions,
  forms,
  brandThemes,
} from "@/db/schema";
import type { ThemeColors, ThemeFontFamily, ThemeDesign } from "@/db/theme";
import type { PageBlockData } from "@/db/blocks";
import { validateBlockContent, type BlockType } from "@/db/blocks";

// Fallbacks estáticos (Etapa 1) — se usan solo si no hay DB configurada.
import { siteConfig } from "@/data/site";
import { mainNav, headerCta, footerNav } from "@/data/navigation";
import { topics as staticTopics } from "@/data/topics";
import { latestUpdates as staticUpdates } from "@/data/updates";
import { participationOptions as staticParticipation } from "@/data/participation";

/**
 * Capa de acceso a datos para el sitio público.
 *
 * Si DATABASE_URL está configurada, todo se lee de Supabase/Postgres vía
 * Drizzle. Si no, cada función devuelve el contenido estático equivalente
 * de src/data/*.ts, para que el sitio siga funcionando mientras se termina
 * de configurar el CMS.
 */

// ---------------------------------------------------------------------------
// Configuración del sitio
// ---------------------------------------------------------------------------

// `cache()` memoiza esto por request: layout, Header y Footer piden la
// configuración por separado, así se hace una sola consulta a la base en
// vez de tres.
export const getSiteSettings = cache(async function getSiteSettings() {
  if (!isDbConfigured) {
    return {
      name: siteConfig.name,
      tagline: siteConfig.tagline,
      description: siteConfig.description,
      contactEmail: siteConfig.contact.email,
      whatsappNumber: siteConfig.contact.whatsapp.phoneNumber,
      whatsappMessage: siteConfig.contact.whatsapp.defaultMessage,
      instagramUrl: siteConfig.social.instagram ?? null,
      facebookUrl: siteConfig.social.facebook ?? null,
      twitterUrl: siteConfig.social.twitter ?? null,
      tiktokUrl: siteConfig.social.tiktok ?? null,
      youtubeUrl: siteConfig.social.youtube ?? null,
      ogImageUrl: siteConfig.defaultMetadata.ogImage ?? null,
    };
  }

  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
  return settings ?? null;
});

/**
 * El perfil de identidad visual actualmente aplicado al sitio público (ver
 * /admin/identidad), o null si no hay ninguno aplicado (diseño original).
 */
export const getActiveBrandTheme = cache(async function getActiveBrandTheme(): Promise<{
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
  design: ThemeDesign;
} | null> {
  if (!isDbConfigured) return null;

  const [row] = await db
    .select({
      colors: brandThemes.colors,
      fontFamily: brandThemes.fontFamily,
      shape: brandThemes.shape,
      shadowStyle: brandThemes.shadowStyle,
      typeScale: brandThemes.typeScale,
      density: brandThemes.density,
      logoUrl: brandThemes.logoUrl,
      headerDisplay: brandThemes.headerDisplay,
    })
    .from(siteSettings)
    .innerJoin(brandThemes, eq(siteSettings.activeBrandThemeId, brandThemes.id))
    .where(eq(siteSettings.id, 1));

  if (!row) return null;
  return {
    colors: row.colors as ThemeColors,
    fontFamily: row.fontFamily as ThemeFontFamily,
    design: {
      shape: row.shape as ThemeDesign["shape"],
      shadowStyle: row.shadowStyle as ThemeDesign["shadowStyle"],
      typeScale: row.typeScale,
      density: row.density,
      logoUrl: row.logoUrl,
      headerDisplay: row.headerDisplay as ThemeDesign["headerDisplay"],
    },
  };
});

// ---------------------------------------------------------------------------
// Navegación
// ---------------------------------------------------------------------------

export async function getNavItems(location: "main" | "header_cta" | "footer") {
  if (!isDbConfigured) {
    if (location === "main") return mainNav;
    if (location === "header_cta") return [headerCta];
    return footerNav;
  }

  return db
    .select()
    .from(navItems)
    .where(eq(navItems.location, location))
    .orderBy(asc(navItems.order));
}

// ---------------------------------------------------------------------------
// Páginas (page builder)
// ---------------------------------------------------------------------------

export async function getPublishedPageBySlug(slug: string) {
  if (!isDbConfigured) return null;

  const [page] = await db
    .select()
    .from(pages)
    .where(and(eq(pages.slug, slug), eq(pages.status, "published")));

  if (!page) return null;

  const blocks = await db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, page.id))
    .orderBy(asc(pageBlocks.order));

  const validatedBlocks: PageBlockData[] = blocks.map((block) => ({
    id: block.id,
    type: block.type as BlockType,
    content: validateBlockContent(block.type as BlockType, block.content),
  })) as PageBlockData[];

  return { ...page, blocks: validatedBlocks };
}

// ---------------------------------------------------------------------------
// Ideas / ejes temáticos
// ---------------------------------------------------------------------------

export async function getPublishedTopics() {
  if (!isDbConfigured) return staticTopics;

  return db
    .select()
    .from(topics)
    .where(eq(topics.published, true))
    .orderBy(asc(topics.order));
}

export async function getTopicBySlug(slug: string) {
  if (!isDbConfigured) {
    return staticTopics.find((t) => t.slug === slug) ?? null;
  }

  const [topic] = await db.select().from(topics).where(eq(topics.slug, slug));
  return topic ?? null;
}

// ---------------------------------------------------------------------------
// Actualidad
// ---------------------------------------------------------------------------

export async function getPublishedPosts(limit?: number) {
  if (!isDbConfigured) {
    return limit ? staticUpdates.slice(0, limit) : staticUpdates;
  }

  const query = db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));

  const rows = limit ? await query.limit(limit) : await query;

  // Adaptador: el componente ArticleCard espera { slug, title, excerpt,
  // date, category } — mapeamos desde el modelo de DB.
  return rows.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: (post.publishedAt ?? post.createdAt).toISOString(),
    category: post.category,
  }));
}

export async function getPostBySlug(slug: string) {
  if (!isDbConfigured) {
    const update = staticUpdates.find((u) => u.slug === slug);
    return update
      ? { ...update, body: null, coverImageUrl: null, title: update.title }
      : null;
  }

  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
  return post ?? null;
}

// ---------------------------------------------------------------------------
// Agenda
// ---------------------------------------------------------------------------

export async function getPublishedEvents() {
  if (!isDbConfigured) return [];

  return db
    .select()
    .from(events)
    .where(eq(events.published, true))
    .orderBy(asc(events.startsAt));
}

// ---------------------------------------------------------------------------
// Equipo
// ---------------------------------------------------------------------------

export async function getPublishedTeamMembers() {
  if (!isDbConfigured) return [];

  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.published, true))
    .orderBy(asc(teamMembers.order));
}

// ---------------------------------------------------------------------------
// Participación
// ---------------------------------------------------------------------------

export async function getPublishedParticipationOptions() {
  if (!isDbConfigured) return staticParticipation;

  return db
    .select({
      id: participationOptions.id,
      title: participationOptions.title,
      description: participationOptions.description,
      order: participationOptions.order,
      published: participationOptions.published,
      formId: participationOptions.formId,
      formSlug: forms.slug,
      formName: forms.name,
      formDescription: forms.description,
      formFields: forms.fields,
      formSuccessMessage: forms.successMessage,
    })
    .from(participationOptions)
    .leftJoin(forms, eq(participationOptions.formId, forms.id))
    .where(eq(participationOptions.published, true))
    .orderBy(asc(participationOptions.order));
}
