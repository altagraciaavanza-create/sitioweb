import { Section } from "@/components/ui/Section";
import { PageRenderer } from "@/components/blocks/PageRenderer";
import { getPublishedPageBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { visionAffirmations } from "@/data/vision-affirmations";

export const metadata = buildMetadata({
  path: "/nosotros",
  title: "Nosotros",
  description: "Quiénes somos, por qué nace Alta Gracia Avanza y qué buscamos construir.",
});

export default async function NosotrosPage() {
  // Igual que la home: si ya existe como página del page builder (ver
  // scripts/seed-secondary-pages.ts), se renderiza editable en vivo; si no,
  // cae al contenido estático de siempre.
  const page = await getPublishedPageBySlug("nosotros");
  if (page) {
    return <PageRenderer pageId={page.id} blocks={page.blocks} />;
  }

  return (
    <Section tone="default">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          Nosotros
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-fg-muted">
          Alta Gracia Avanza es un espacio político local que nace de la
          convicción de que la ciudad puede tener una administración más
          abierta, ordenada y cercana a sus vecinos.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-fg-muted">
          No representamos una candidatura individual: somos un espacio que
          se construye colectivamente, con la participación de quienes creen
          que Alta Gracia puede avanzar.
        </p>

        <h2 className="mt-16 text-2xl font-extrabold tracking-tight text-fg md:text-3xl">
          La Alta Gracia que queremos
        </h2>
        <div className="mt-8 space-y-8">
          {visionAffirmations.map((text) => (
            <p
              key={text}
              className="border-l-4 border-brand-500 pl-6 text-xl font-semibold leading-snug text-fg md:text-2xl"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
