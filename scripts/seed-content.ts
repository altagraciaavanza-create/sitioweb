/**
 * Carga el contenido inicial (menú, datos institucionales, ejes temáticos,
 * opciones de participación y novedades de ejemplo) en la base de datos.
 *
 * Es el mismo contenido que el sitio mostraba en modo estático (Etapa 1),
 * ahora movido a la base para que se pueda editar desde el panel admin.
 * Es seguro correrlo más de una vez: no duplica ni pisa contenido que ya
 * hayas editado manualmente.
 *
 * Uso:
 *   npx tsx scripts/seed-content.ts
 *
 * Requiere DATABASE_URL configurada en .env.local (o en el entorno).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config(); // fallback: .env, sin pisar lo ya cargado

import { sql } from "drizzle-orm";

async function main() {
  // Import dinámico A PROPÓSITO: un "import" estático de ../src/db se
  // resuelve (require) antes de que corran las líneas de arriba —tsx/esbuild
  // mueven los imports estáticos al principio del archivo—, así que
  // DATABASE_URL todavía no existiría cuando se arma la conexión. Con
  // import() dinámico, en cambio, se ejecuta en el orden real del código,
  // después de cargar .env.local.
  const { db } = await import("../src/db");
  const { navItems, siteSettings, topics, participationOptions, posts } = await import(
    "../src/db/schema"
  );

  async function seedNavItems() {
    const [{ count }] = await db.execute<{ count: number }>(
      sql`select count(*)::int as count from ${navItems}`
    );
    if (count > 0) {
      console.log(`nav_items: ya hay ${count} ítems cargados, no toco nada.`);
      return;
    }

    const main = [
      { label: "Inicio", href: "/" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Ideas", href: "/ideas" },
      { label: "Participá", href: "/participa" },
      { label: "Actualidad", href: "/actualidad" },
    ];
    const headerCta = [{ label: "Sumate", href: "/participa" }];
    const footer = [
      { label: "Agenda", href: "/agenda" },
      { label: "Equipo", href: "/equipo" },
      { label: "Transparencia", href: "/transparencia" },
      { label: "Contacto", href: "/contacto" },
      { label: "Documentos", href: "/transparencia" },
    ];

    await db.insert(navItems).values([
      ...main.map((item, i) => ({ ...item, location: "main" as const, order: i })),
      ...headerCta.map((item, i) => ({ ...item, location: "header_cta" as const, order: i })),
      ...footer.map((item, i) => ({ ...item, location: "footer" as const, order: i })),
    ]);
    console.log(`nav_items: cargados ${main.length + headerCta.length + footer.length} ítems.`);
  }

  async function seedSiteSettings() {
    const existing = await db.select().from(siteSettings).limit(1);
    if (existing.length > 0) {
      console.log("site_settings: ya existe configuración, no toco nada.");
      return;
    }

    await db.insert(siteSettings).values({
      id: 1,
      name: "Alta Gracia Avanza",
      tagline: "Alta Gracia puede avanzar.",
      description:
        "Alta Gracia Avanza es un espacio político local que promueve una ciudad más libre, transparente, moderna y con oportunidades, construida con la participación de sus vecinos.",
      contactEmail: "contacto@altagraciaavanza.ar",
      whatsappNumber: "5493547000000",
      whatsappMessage: "Hola, quiero conocer más sobre Alta Gracia Avanza.",
      instagramUrl: "https://instagram.com/altagraciaavanza",
      facebookUrl: "https://facebook.com/altagraciaavanza",
    });
    console.log("site_settings: configuración inicial cargada.");
    console.log(
      "  Recordá: email, WhatsApp, Instagram y Facebook son placeholders (TODO) — actualizalos desde /admin/settings con los datos reales."
    );
  }

  async function seedTopics() {
    const data = [
      {
        slug: "desarrollo-economico",
        title: "Desarrollo económico",
        summary: "Más oportunidades para emprender, producir y generar trabajo en Alta Gracia.",
      },
      {
        slug: "estado-eficiente",
        title: "Estado eficiente",
        summary: "Una Municipalidad que resuelva problemas en lugar de agregar trámites.",
      },
      {
        slug: "ciudad",
        title: "Ciudad",
        summary: "Infraestructura, movilidad y espacios públicos pensados para el vecino.",
      },
      {
        slug: "instituciones",
        title: "Instituciones",
        summary: "Instituciones locales sólidas, previsibles y transparentes.",
      },
      {
        slug: "ambiente",
        title: "Ambiente",
        summary: "Cuidado del entorno natural y patrimonio ambiental de la ciudad.",
      },
      {
        slug: "cultura-educacion",
        title: "Cultura y educación",
        summary: "Más oportunidades culturales y educativas para todas las edades.",
      },
      {
        slug: "seguridad-convivencia",
        title: "Seguridad y convivencia",
        summary: "Una ciudad donde se pueda circular y convivir con tranquilidad.",
      },
    ];

    let inserted = 0;
    for (let i = 0; i < data.length; i++) {
      const result = await db
        .insert(topics)
        .values({ ...data[i], order: i })
        .onConflictDoNothing({ target: topics.slug })
        .returning({ id: topics.id });
      if (result.length > 0) inserted++;
    }
    console.log(`topics: ${inserted} eje(s) temático(s) nuevo(s) cargado(s) (${data.length - inserted} ya existían).`);
  }

  async function seedParticipationOptions() {
    const [{ count }] = await db.execute<{ count: number }>(
      sql`select count(*)::int as count from ${participationOptions}`
    );
    if (count > 0) {
      console.log(`participation_options: ya hay ${count} opciones cargadas, no toco nada.`);
      return;
    }

    const data = [
      { title: "Quiero conocer el espacio", description: "Recibí información sobre quiénes somos y qué proponemos." },
      { title: "Quiero asistir a una reunión", description: "Sumate a nuestros próximos encuentros abiertos." },
      { title: "Quiero aportar una idea", description: "Contanos un problema o una propuesta para tu barrio." },
      { title: "Quiero colaborar", description: "Sumá tu tiempo o tus capacidades al espacio." },
      { title: "Quiero participar de un equipo temático", description: "Sumate a un equipo de trabajo por área." },
      { title: "Quiero fiscalizar", description: "Formá parte del cuerpo de fiscales de Alta Gracia Avanza." },
      { title: "Quiero afiliarme", description: "Formalizá tu participación en el espacio." },
    ];

    await db.insert(participationOptions).values(data.map((item, i) => ({ ...item, order: i })));
    console.log(`participation_options: cargadas ${data.length} opciones.`);
  }

  async function seedPosts() {
    const data = [
      {
        slug: "segunda-reunion-alta-gracia-avanza",
        title: "Segunda reunión abierta de Alta Gracia Avanza",
        date: "2026-08-10",
        excerpt:
          "Vecinos y vecinas se reunieron para seguir construyendo la agenda de propuestas para la ciudad. (Contenido de ejemplo, editable.)",
        category: "reuniones" as const,
      },
      {
        slug: "primer-encuentro-equipos-tematicos",
        title: "Primer encuentro de equipos temáticos",
        date: "2026-07-28",
        excerpt: "Se conformaron los primeros equipos de trabajo por área temática. (Contenido de ejemplo, editable.)",
        category: "actividades" as const,
      },
      {
        slug: "recorrida-por-barrios",
        title: "Recorrida por barrios de Alta Gracia",
        date: "2026-07-15",
        excerpt: "Charlas con comerciantes y vecinos para relevar necesidades concretas. (Contenido de ejemplo, editable.)",
        category: "recorridas" as const,
      },
    ];

    let inserted = 0;
    for (const item of data) {
      const result = await db
        .insert(posts)
        .values({
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          category: item.category,
          status: "published",
          publishedAt: new Date(item.date),
        })
        .onConflictDoNothing({ target: posts.slug })
        .returning({ id: posts.id });
      if (result.length > 0) inserted++;
    }
    console.log(`posts: ${inserted} novedad(es) de ejemplo cargada(s) (${data.length - inserted} ya existían).`);
    console.log("  Son contenido de ejemplo — reemplazalas o borralas desde /admin/posts cuando tengas novedades reales.");
  }

  console.log("Cargando contenido inicial...\n");
  await seedNavItems();
  await seedSiteSettings();
  await seedTopics();
  await seedParticipationOptions();
  await seedPosts();
  console.log("\nListo.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
