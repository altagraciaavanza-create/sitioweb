import { Section } from "@/components/ui/Section";
import { PrincipleCard } from "@/components/ui/PrincipleCard";
import { principles } from "@/data/principles";

export function PrinciplesSection() {
  return (
    <Section tone="subtle">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
          Nuestras convicciones
        </h2>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {principles.map((principle) => (
          <PrincipleCard key={principle.slug} principle={principle} />
        ))}
      </div>
    </Section>
  );
}
