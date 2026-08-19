import { Section } from "@/components/ui/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/propuestas",
  title: "Propuestas",
  description: "Banco de ideas ciudadano de Alta Gracia Avanza.",
});

export default function PropuestasPage() {
  return (
    <Section tone="default">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          Banco de ideas
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Muy pronto vas a poder enviar tu idea o problema directamente desde
          acá.
        </p>
      </div>
      <div className="mt-12">
        <EmptyState
          title="Esta funcionalidad está en construcción"
          description="Mientras tanto, contanos tu idea desde la sección Participá."
          action={<Button href="/participa">Ir a Participá</Button>}
        />
      </div>
    </Section>
  );
}
