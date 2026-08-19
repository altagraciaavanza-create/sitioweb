import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-brand-50),_transparent_60%)]"
      />
      <Container className="flex flex-col items-start gap-8 py-20 md:py-32">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-fg sm:text-5xl md:text-6xl">
          Alta Gracia puede avanzar.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-fg-muted md:text-xl">
          Una ciudad más libre, transparente, moderna y con oportunidades se
          construye participando.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="/ideas" size="lg">
            Conocé nuestras ideas
          </Button>
          <Button href="/participa" size="lg" variant="secondary">
            Sumate
          </Button>
        </div>
      </Container>
    </section>
  );
}
