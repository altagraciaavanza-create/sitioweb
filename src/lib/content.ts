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
} from "@/db/schema";
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

export async function getSiteSettings() {
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
    };
  }

  const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
  return settings ?? null;
}

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
    .select()
    .from(participationOptions)
    .where(eq(participationOptions.published, true))
    .orderBy(asc(participationOptions.order));
}
