import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/nosotros",
  title: "Nosotros",
  description: "Quiénes somos, por qué nace Alta Gracia Avanza y qué buscamos construir.",
});

export default function NosotrosPage() {
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
          que Alta Gracia puede avanzar. (Contenido institucional a
          completar.)
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Por qué nacemos",
              text: "Contenido editable — completar con la historia del espacio.",
            },
            {
              title: "Qué buscamos construir",
              text: "Contenido editable — completar con la visión de largo plazo.",
            },
            {
              title: "Nuestra visión de la política local",
              text: "Contenido editable — completar con los principios rectores.",
            },
          ].map((block) => (
            <div key={block.title} className="rounded-lg border border-border p-6">
              <h2 className="text-base font-semibold text-fg">{block.title}</h2>
              <p className="mt-2 text-sm text-fg-muted">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
