import { Section } from "@/components/ui/Section";

export function Intro() {
  return (
    <Section tone="default">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
          No venimos a ocupar un espacio. Venimos a construir uno.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-fg-muted">
          Alta Gracia Avanza nace de la convicción de que la ciudad necesita
          un espacio político nuevo: cercano, transparente y enfocado en
          ideas concretas. Un lugar donde cualquier vecino pueda sumarse,
          aportar y participar, sin necesidad de ser político.
        </p>
      </div>
    </Section>
  );
}
