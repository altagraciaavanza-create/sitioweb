import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * Esquema de base de datos para el CMS de Alta Gracia Avanza.
 *
 * Convenciones:
 * - Todas las tablas de contenido tienen `createdAt` / `updatedAt`.
 * - El contenido "flexible" (bloques de página) vive en `jsonb` tipado en
 *   TypeScript por convención (ver src/db/blocks.ts), no por constraint de DB.
 * - Los slugs son únicos y son los que arman las URLs públicas.
 */

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

// ---------------------------------------------------------------------------
// Configuración institucional (reemplaza src/data/site.ts en runtime)
// ---------------------------------------------------------------------------

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1), // fila única (singleton)
  name: text("name").notNull().default("Alta Gracia Avanza"),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  contactEmail: text("contact_email"),
  whatsappNumber: text("whatsapp_number"),
  whatsappMessage: text("whatsapp_message"),
  instagramUrl: text("instagram_url"),
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  tiktokUrl: text("tiktok_url"),
  youtubeUrl: text("youtube_url"),
  ogImageUrl: text("og_image_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Navegación (editable desde el panel: agregar/quitar/reordenar ítems)
// ---------------------------------------------------------------------------

export const navLocationEnum = pgEnum("nav_location", ["main", "header_cta", "footer"]);

export const navItems = pgTable("nav_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  location: navLocationEnum("location").notNull().default("main"),
  label: text("label").notNull(),
  href: text("href").notNull(),
  order: integer("order").notNull().default(0),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
});

// ---------------------------------------------------------------------------
// Page builder: páginas y bloques
// ---------------------------------------------------------------------------

export const pageStatusEnum = pgEnum("page_status", ["draft", "published"]);

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(), // "" = home ("/")
  title: text("title").notNull(),
  metaDescription: text("meta_description"),
  status: pageStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Cada fila es un bloque de contenido dentro de una página.
 * `type` determina qué componente React lo renderiza (ver src/db/blocks.ts)
 * y `content` guarda las props de ese bloque en JSON.
 */
export const pageBlocks = pgTable("page_blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id")
    .notNull()
    .references(() => pages.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  order: integer("order").notNull().default(0),
  content: jsonb("content").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Equipo
// ---------------------------------------------------------------------------

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role"),
  activity: text("activity"),
  photoUrl: text("photo_url"),
  whyParticipate: text("why_participate"),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

// ---------------------------------------------------------------------------
// Ideas / ejes temáticos (Ideas para Alta Gracia)
// ---------------------------------------------------------------------------

export const topics = pgTable("topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  problem: text("problem"),
  diagnosis: text("diagnosis"),
  proposal: text("proposal"),
  expectedImpact: text("expected_impact"),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

// ---------------------------------------------------------------------------
// Actualidad (posts institucionales)
// ---------------------------------------------------------------------------

export const postCategoryEnum = pgEnum("post_category", [
  "reuniones",
  "actividades",
  "documentos",
  "propuestas",
  "comunicados",
  "recorridas",
  "posiciones_institucionales",
]);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body"), // markdown
  category: postCategoryEnum("category").notNull().default("comunicados"),
  coverImageUrl: text("cover_image_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  status: pageStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Agenda (eventos)
// ---------------------------------------------------------------------------

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  location: text("location"),
  ctaLabel: text("cta_label"),
  ctaHref: text("cta_href"),
  published: boolean("published").notNull().default(true),
});

// ---------------------------------------------------------------------------
// Participación (opciones estáticas de /participa)
// ---------------------------------------------------------------------------

export const participationOptions = pgTable("participation_options", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

// ---------------------------------------------------------------------------
// Banco de ideas ciudadano (Etapa 2, /propuestas) — envíos de vecinos
// ---------------------------------------------------------------------------

export const proposalStatusEnum = pgEnum("proposal_status", [
  "recibida",
  "en_revision",
  "en_analisis",
  "en_desarrollo",
  "incorporada",
  "descartada",
]);

export const proposalSubmissions = pgTable("proposal_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  contact: text("contact"),
  neighborhood: text("neighborhood"),
  category: text("category"),
  problem: text("problem").notNull(),
  proposal: text("proposal").notNull(),
  privacyConsent: boolean("privacy_consent").notNull().default(false),
  status: proposalStatusEnum("status").notNull().default("recibida"),
  publiclyVisible: boolean("publicly_visible").notNull().default(false),
  publicSlug: text("public_slug").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// Contactos recibidos desde /contacto y /participa
// ---------------------------------------------------------------------------

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  interest: text("interest"), // opción elegida en /participa, si aplica
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
