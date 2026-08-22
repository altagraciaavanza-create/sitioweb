/**
 * Convierte Nosotros, Ideas, Equipo y Visión en páginas reales del page
 * builder (tabla `pages` + `page_blocks`), con el mismo contenido que hoy
 * vive hardcodeado en cada src/app/<slug>/page.tsx — así quedan editables
 * desde el modo edición en vivo, igual que ya pasó con la home (ver
 * scripts/seed-home-page.ts, mismo patrón).
 *
 * Idempotente: si una página con ese slug ya existe, no la toca (no
 * duplica bloques en cada corrida) — se puede correr de nuevo sin miedo.
 *
 * Uso:
 *   npx tsx scripts/seed-secondary-pages.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

type SeedPage = {
  slug: string;
  title: string;
  metaDescription: string;
  blocks: { type: string; content: Record<string, unknown> }[];
};

const pagesToSeed: SeedPage[] = [
  {
    slug: "nosotros",
    title: "Nosotros",
    metaDescription: "Quiénes somos, por qué nace Alta Gracia Avanza y qué buscamos construir.",
    blocks: [
      {
        type: "rich_text",
        content: {
          title: "Nosotros",
          body: "Alta Gracia Avanza es un espacio político local que nace de la convicción de que la ciudad puede tener una administración más abierta, ordenada y cercana a sus vecinos.\n\nNo representamos una candidatura individual: somos un espacio que se construye colectivamente, con la participación de quienes creen que Alta Gracia puede avanzar. (Contenido institucional a completar.)",
          align: "left",
        },
      },
      {
        type: "info_cards",
        content: {
          items: [
            { title: "Por qué nacemos", description: "Contenido editable — completar con la historia del espacio." },
            { title: "Qué buscamos construir", description: "Contenido editable — completar con la visión de largo plazo." },
            { title: "Nuestra visión de la política local", description: "Contenido editable — completar con los principios rectores." },
          ],
        },
      },
    ],
  },
  {
    slug: "ideas",
    title: "Ideas",
    metaDescription: "Ideas y propuestas de Alta Gracia Avanza organizadas por eje temático.",
    blocks: [
      {
        type: "topic_grid",
        content: {
          title: "Ideas para Alta Gracia",
          description: "Nuestra agenda de propuestas, organizada por eje temático.",
          source: "all_topics",
        },
      },
    ],
  },
  {
    slug: "equipo",
    title: "Equipo",
    metaDescription: "Conocé a las personas que forman parte de Alta Gracia Avanza.",
    blocks: [
      {
        type: "team_grid",
        content: {
          title: "Equipo",
          description: "Las personas que forman parte de Alta Gracia Avanza.",
        },
      },
    ],
  },
  {
    slug: "vision",
    title: "Alta Gracia que queremos",
    metaDescription: "La visión de ciudad de Alta Gracia Avanza.",
    blocks: [
      {
        type: "affirmations",
        content: {
          title: "La Alta Gracia que queremos",
          items: [
            { text: "Una Municipalidad que resuelva problemas en lugar de agregar trámites." },
            { text: "Una ciudad donde emprender y abrir un comercio sea más sencillo." },
            { text: "Una administración donde el vecino pueda conocer cómo se utilizan los recursos públicos." },
            { text: "Una Alta Gracia que genere oportunidades para quienes quieren construir su futuro en la ciudad." },
          ],
        },
      },
    ],
  },
];

async function main() {
  const { eq } = await import("drizzle-orm");
  const { db, isDbConfigured } = await import("../src/db");
  const { pages, pageBlocks } = await import("../src/db/schema");

  if (!isDbConfigured) {
    console.error("Falta DATABASE_URL en .env.local.");
    process.exit(1);
  }

  for (const seed of pagesToSeed) {
    const [existing] = await db.select().from(pages).where(eq(pages.slug, seed.slug));
    if (existing) {
      console.log(`"${seed.slug}" ya es una página del page builder (no se toca nada). id:`, existing.id);
      continue;
    }

    const [page] = await db
      .insert(pages)
      .values({
        slug: seed.slug,
        title: seed.title,
        metaDescription: seed.metaDescription,
        status: "published",
      })
      .returning();

    await db.insert(pageBlocks).values(
      seed.blocks.map((b, index) => ({ pageId: page.id, type: b.type, order: index, content: b.content }))
    );

    console.log(`"${seed.slug}" creada como página del page builder (id: ${page.id}) con ${seed.blocks.length} bloque(s).`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
