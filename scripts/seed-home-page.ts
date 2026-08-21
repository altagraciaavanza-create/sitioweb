/**
 * Convierte la home ("/") en una página real del page builder (tabla
 * `pages` + `page_blocks`), con el mismo contenido que hoy vive hardcodeado
 * en src/components/home/*.tsx — así queda editable desde el nuevo modo
 * edición en vivo (doble clic sobre el texto + selector de color), sin
 * cambiar ni una palabra de lo que ya se ve hoy.
 *
 * Única diferencia visual: la última sección ("No hace falta ser político
 * para participar en política") pasa de fondo claro a el mismo bloque de
 * fondo oscuro que "Tu idea también puede cambiar la ciudad", porque el
 * page builder todavía tiene un solo tipo de bloque de CTA (`cta`) y ese
 * usa fondo de marca. Si preferís mantenerla clara, avisá y la dejamos
 * como bloque `rich_text` en cambio.
 *
 * Idempotente: si ya existe una página con slug "", no crea nada de nuevo
 * (no duplica bloques en cada corrida).
 *
 * Uso:
 *   npx tsx scripts/seed-home-page.ts
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

  const [existing] = await db.select().from(pages).where(eq(pages.slug, ""));
  if (existing) {
    console.log("La home ya es una página del page builder (no se toca nada). id:", existing.id);
    process.exit(0);
  }

  const [page] = await db
    .insert(pages)
    .values({
      slug: "",
      title: "Inicio",
      metaDescription:
        "Alta Gracia Avanza: una ciudad más libre, transparente, moderna y con oportunidades se construye participando.",
      status: "published",
    })
    .returning();

  const blocks: { type: string; order: number; content: Record<string, unknown> }[] = [
    {
      type: "hero",
      order: 0,
      content: {
        title: "Alta Gracia puede avanzar.",
        description:
          "Una ciudad más libre, transparente, moderna y con oportunidades se construye participando.",
        primaryCta: { label: "Conocé nuestras ideas", href: "/ideas" },
        secondaryCta: { label: "Sumate", href: "/participa" },
      },
    },
    {
      type: "rich_text",
      order: 1,
      content: {
        title: "No venimos a ocupar un espacio. Venimos a construir uno.",
        body: "Alta Gracia Avanza nace de la convicción de que la ciudad necesita un espacio político nuevo: cercano, transparente y enfocado en ideas concretas. Un lugar donde cualquier vecino pueda sumarse, aportar y participar, sin necesidad de ser político.",
        align: "center",
      },
    },
    {
      type: "principles",
      order: 2,
      content: {
        title: "Nuestras convicciones",
        items: [
          {
            title: "Libertad",
            description:
              "Creemos en una ciudad donde cada vecino pueda desarrollar su proyecto de vida sin trabas innecesarias.",
          },
          {
            title: "Transparencia",
            description:
              "La gestión pública debe poder explicarse y verificarse. La transparencia es una práctica, no una promesa.",
          },
          {
            title: "Desarrollo",
            description:
              "Impulsar las condiciones para que Alta Gracia crezca: más oportunidades para emprender, producir y trabajar.",
          },
          {
            title: "Instituciones",
            description: "Instituciones sólidas y previsibles como base de una ciudad que funciona para todos.",
          },
          {
            title: "Participación",
            description: "No hace falta ser político para participar en política. Cada idea vecinal suma.",
          },
        ],
      },
    },
    {
      type: "topic_grid",
      order: 3,
      content: {
        title: "Agenda para Alta Gracia",
        description: "Los ejes que guían nuestra visión de ciudad.",
        source: "all_topics",
      },
    },
    {
      type: "article_grid",
      order: 4,
      content: {
        title: "Estamos trabajando",
        description: "Últimas reuniones, actividades y novedades del espacio.",
        limit: 3,
        ctaLabel: "Ver toda la actualidad",
        ctaHref: "/actualidad",
      },
    },
    {
      type: "cta",
      order: 5,
      content: {
        title: "Tu idea también puede cambiar la ciudad.",
        description: "Contanos qué problema ves en tu barrio o qué propuesta tenés para Alta Gracia.",
        ctaLabel: "Proponer una idea",
        ctaHref: "/participa",
      },
    },
    {
      type: "cta",
      order: 6,
      content: {
        title: "No hace falta ser político para participar en política.",
        description: "Sumate a Alta Gracia Avanza, a tu ritmo y desde donde quieras empezar.",
        ctaLabel: "Quiero participar",
        ctaHref: "/participa",
      },
    },
  ];

  await db.insert(pageBlocks).values(
    blocks.map((b) => ({ pageId: page.id, type: b.type, order: b.order, content: b.content }))
  );

  console.log(`Home creada como página del page builder (id: ${page.id}) con ${blocks.length} bloques.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
