import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { getPublishedParticipationOptions } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/participa",
  title: "Participá",
  description: "Diferentes formas de sumarte a Alta Gracia Avanza, sin barreras de entrada.",
});

export default async function ParticipaPage() {
  const options = await getPublishedParticipationOptions();

  return (
    <Section tone="default">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          Participá
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          No hace falta ser político para participar en política. Elegí cómo
          querés sumarte.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option, index) => (
          <Card key={"slug" in option ? option.slug : index} className="h-full">
            <h2 className="text-base font-semibold text-fg">{option.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {option.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
