/**
 * Ajusta el `content` de los bloques de la home ya sembrada
 * (scripts/seed-home-page.ts) para que coincida con el mockup de la
 * landing aprobado: la sección "No venimos a ocupar..." pasa a fondo
 * subtle (antes no tenía el campo `tone`, que se agregó recién), y la
 * segunda sección de CTA ("No hace falta ser político...") pasa a estilo
 * "plain" en vez de "solid" (que es como queda si no se toca, porque es el
 * default del schema — el mockup la muestra sobre fondo de página, no
 * sobre el bloque naranja lleno).
 *
 * Es seguro correrlo más de una vez: siempre deja los mismos valores, no
 * duplica nada.
 *
 * Uso:
 *   npx tsx scripts/update-home-design-content.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

async function main() {
  const { eq } = await import("drizzle-orm");
  const { db, isDbConfigured } = await import("../src/db");
  const { pages, pageBlocks } = await import("../src/db/schema");

  if (!isDbConfigured) {
    console.error("Falta DATABASE_URL en .env.local.");
    process.exit(1);
  }

  const [home] = await db.select().from(pages).where(eq(pages.slug, ""));
  if (!home) {
    console.error('No existe la página home (slug ""). Corré primero npm run db:seed-home-page.');
    process.exit(1);
  }

  const blocks = await db.select().from(pageBlocks).where(eq(pageBlocks.pageId, home.id));

  const richText = blocks.find((b) => b.type === "rich_text");
  if (richText) {
    await db
      .update(pageBlocks)
      .set({ content: { ...(richText.content as object), tone: "subtle" } })
      .where(eq(pageBlocks.id, richText.id));
    console.log("Intro (rich_text): tone = subtle.");
  }

  const ctaBlocks = blocks.filter((b) => b.type === "cta").sort((a, b) => a.order - b.order);
  if (ctaBlocks[1]) {
    await db
      .update(pageBlocks)
      .set({ content: { ...(ctaBlocks[1].content as object), style: "plain" } })
      .where(eq(pageBlocks.id, ctaBlocks[1].id));
    console.log('Segundo CTA ("No hace falta ser político..."): style = plain.');
  }
  if (ctaBlocks[0]) {
    await db
      .update(pageBlocks)
      .set({ content: { ...(ctaBlocks[0].content as object), style: "solid" } })
      .where(eq(pageBlocks.id, ctaBlocks[0].id));
    console.log('Primer CTA ("Tu idea también..."): style = solid.');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
