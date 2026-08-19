import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Button } from "@/components/ui/Button";
import { latestUpdates } from "@/data/updates";

export function CurrentActivity() {
  return (
    <Section tone="subtle">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
            Estamos trabajando
          </h2>
          <p className="mt-3 text-lg text-fg-muted">
            Últimas reuniones, actividades y novedades del espacio.
          </p>
        </div>
        <Button href="/actualidad" variant="secondary">
          Ver toda la actualidad
        </Button>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {latestUpdates.map((update) => (
          <ArticleCard key={update.slug} update={update} />
        ))}
      </div>
    </Section>
  );
}
