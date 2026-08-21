/**
 * Arregla columnas que quedaron faltando en la base real por el mismo
 * motivo detectado con "whatsapp_number" (equipo) y "site_settings": en
 * algún momento del desarrollo se agregaron campos nuevos a
 * src/db/schema.ts y, en vez de generarse como una migración nueva,
 * terminaron mezclados dentro de la migración 0000 (la del esquema
 * inicial). Como esa migración ya figuraba "aplicada" en tu base (por su
 * fecha), Drizzle nunca la vuelve a mirar, así que esas columnas nunca se
 * crearon de verdad ahí.
 *
 * Este script recorre TODAS las columnas de las tablas que existían en la
 * migración 0000 y agrega, de forma segura e idempotente (IF NOT EXISTS —
 * no rompe nada si ya existen), cualquiera que falte. Es seguro correrlo
 * las veces que haga falta.
 *
 * Uso:
 *   npx tsx scripts/repair-schema.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

// Generadas a partir de src/db/migrations/0000_reflective_lord_tyger.sql:
// una sentencia ADD COLUMN IF NOT EXISTS por cada columna no-PK de cada
// tabla original. Si la columna ya existe, no hace nada.
const STATEMENTS: string[] = [
  `ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "username" text NOT NULL`,
  `ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "password_hash" text NOT NULL`,
  `ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "admin_users" ADD COLUMN IF NOT EXISTS "last_login_at" timestamp with time zone`,
  `ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "name" text NOT NULL`,
  `ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "email" text NOT NULL`,
  `ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "message" text NOT NULL`,
  `ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "interest" text`,
  `ALTER TABLE "contact_submissions" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "title" text NOT NULL`,
  `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "description" text`,
  `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "starts_at" timestamp with time zone NOT NULL`,
  `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "location" text`,
  `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "cta_label" text`,
  `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "cta_href" text`,
  `ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "published" boolean DEFAULT true NOT NULL`,
  `ALTER TABLE "nav_items" ADD COLUMN IF NOT EXISTS "location" "nav_location" DEFAULT 'main' NOT NULL`,
  `ALTER TABLE "nav_items" ADD COLUMN IF NOT EXISTS "label" text NOT NULL`,
  `ALTER TABLE "nav_items" ADD COLUMN IF NOT EXISTS "href" text NOT NULL`,
  `ALTER TABLE "nav_items" ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0 NOT NULL`,
  `ALTER TABLE "nav_items" ADD COLUMN IF NOT EXISTS "open_in_new_tab" boolean DEFAULT false NOT NULL`,
  `ALTER TABLE "page_blocks" ADD COLUMN IF NOT EXISTS "page_id" uuid NOT NULL`,
  `ALTER TABLE "page_blocks" ADD COLUMN IF NOT EXISTS "type" text NOT NULL`,
  `ALTER TABLE "page_blocks" ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0 NOT NULL`,
  `ALTER TABLE "page_blocks" ADD COLUMN IF NOT EXISTS "content" jsonb DEFAULT '{}'::jsonb NOT NULL`,
  `ALTER TABLE "page_blocks" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "page_blocks" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "slug" text NOT NULL`,
  `ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "title" text NOT NULL`,
  `ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "meta_description" text`,
  `ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "status" "page_status" DEFAULT 'draft' NOT NULL`,
  `ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "participation_options" ADD COLUMN IF NOT EXISTS "title" text NOT NULL`,
  `ALTER TABLE "participation_options" ADD COLUMN IF NOT EXISTS "description" text NOT NULL`,
  `ALTER TABLE "participation_options" ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0 NOT NULL`,
  `ALTER TABLE "participation_options" ADD COLUMN IF NOT EXISTS "published" boolean DEFAULT true NOT NULL`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "slug" text NOT NULL`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "title" text NOT NULL`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "excerpt" text NOT NULL`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "body" text`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "category" "post_category" DEFAULT 'comunicados' NOT NULL`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "cover_image_url" text`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "published_at" timestamp with time zone`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "status" "page_status" DEFAULT 'draft' NOT NULL`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "name" text NOT NULL`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "contact" text`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "neighborhood" text`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "category" text`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "problem" text NOT NULL`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "proposal" text NOT NULL`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "privacy_consent" boolean DEFAULT false NOT NULL`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "status" "proposal_status" DEFAULT 'recibida' NOT NULL`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "publicly_visible" boolean DEFAULT false NOT NULL`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "public_slug" text`,
  `ALTER TABLE "proposal_submissions" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "name" text DEFAULT 'Alta Gracia Avanza' NOT NULL`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "tagline" text DEFAULT '' NOT NULL`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "description" text DEFAULT '' NOT NULL`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_email" text`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "whatsapp_number" text`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "whatsapp_message" text`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "instagram_url" text`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "facebook_url" text`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "twitter_url" text`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "tiktok_url" text`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "youtube_url" text`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "og_image_url" text`,
  `ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "updated_at" timestamp with time zone DEFAULT now() NOT NULL`,
  `ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "name" text NOT NULL`,
  `ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "role" text`,
  `ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "activity" text`,
  `ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "photo_url" text`,
  `ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "why_participate" text`,
  `ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0 NOT NULL`,
  `ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "published" boolean DEFAULT true NOT NULL`,
  `ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "slug" text NOT NULL`,
  `ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "title" text NOT NULL`,
  `ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "summary" text NOT NULL`,
  `ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "problem" text`,
  `ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "diagnosis" text`,
  `ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "proposal" text`,
  `ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "expected_impact" text`,
  `ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0 NOT NULL`,
  `ALTER TABLE "topics" ADD COLUMN IF NOT EXISTS "published" boolean DEFAULT true NOT NULL`,
  // team_members.whatsapp_number (migración 0001) — por las dudas, también
  // idempotente acá.
  `ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "whatsapp_number" text`,
];

async function main() {
  const postgresModule = await import("postgres");
  const postgres = postgresModule.default;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Falta DATABASE_URL en .env.local.");
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1, prepare: false });

  let ok = 0;
  let failed = 0;

  for (const stmt of STATEMENTS) {
    try {
      await sql.unsafe(stmt);
      ok++;
    } catch (error) {
      failed++;
      console.error(`\n[ADVERTENCIA] No se pudo aplicar:\n  ${stmt}\n  ${(error as Error).message}\n`);
    }
  }

  console.log(`\nListo: ${ok} columnas verificadas/creadas, ${failed} con error.`);
  if (failed > 0) {
    console.log("Revisá las advertencias de arriba; puede requerir revisión manual.");
  }

  await sql.end({ timeout: 5 });
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("\nERROR:\n");
  console.error(error);
  process.exit(1);
});
