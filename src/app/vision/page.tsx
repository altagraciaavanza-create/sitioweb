import { Section } from "@/components/ui/Section";
import { PageRenderer } from "@/components/blocks/PageRenderer";
import { getPublishedPageBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { visionAffirmations as affirmations } from "@/data/vision-affirmations";

// Esta página no está linkeada desde ningún lado del sitio (ni menú
// principal ni footer — ver guía de actualización, sección 2) y su
// contenido real ahora se muestra también como subsección de /nosotros.
// Se marca noindex para evitar contenido duplicado en buscadores; la ruta
// se mantiene (no se borra) por si en el futuro se decide activarla como
// página propia.
export const metadata = {
  ...buildMetadata({
    path: "/vision",
    title: "Alta Gracia que queremos",
    description: "La visión de ciudad de Alta Gracia Avanza.",
  }),
  robots: { index: false, follow: true },
};

export default async function VisionPage() {
  const page = await getPublishedPageBySlug("vision");
  if (page) {
    return <PageRenderer pageId={page.id} blocks={page.blocks} />;
  }

  return (
    <Section tone="default">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          La Alta Gracia que queremos
        </h1>
        <div className="mt-12 space-y-10">
          {affirmations.map((text) => (
            <p
              key={text}
              className="border-l-4 border-brand-500 pl-6 text-2xl font-semibold leading-snug text-fg md:text-3xl"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
