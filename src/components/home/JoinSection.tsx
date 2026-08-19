import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export function JoinSection() {
  return (
    <Section tone="default">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
          No hace falta ser político para participar en política.
        </h2>
        <p className="text-lg text-fg-muted">
          Sumate a Alta Gracia Avanza, a tu ritmo y desde donde quieras
          empezar.
        </p>
        <Button href="/participa" size="lg">
          Quiero participar
        </Button>
      </div>
    </Section>
  );
}
