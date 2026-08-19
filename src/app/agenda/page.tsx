import { Section } from "@/components/ui/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPublishedEvents } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/agenda",
  title: "Agenda",
  description: "Próximas actividades y encuentros de Alta Gracia Avanza.",
});

export default async function AgendaPage() {
  const events = await getPublishedEvents();

  return (
    <Section tone="default">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          Agenda
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Próximas actividades y encuentros del espacio.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="Sin actividades programadas por el momento"
            description="Pronto vamos a publicar acá las próximas reuniones y actividades."
          />
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <time dateTime={new Date(event.startsAt).toISOString()} className="text-xs text-fg-muted">
                {formatDate(new Date(event.startsAt).toISOString())}
              </time>
              <h2 className="mt-2 text-base font-semibold text-fg">{event.title}</h2>
              {event.location ? (
                <p className="mt-1 text-sm text-fg-muted">{event.location}</p>
              ) : null}
              {event.description ? (
                <p className="mt-2 text-sm text-fg-muted">{event.description}</p>
              ) : null}
              {event.ctaLabel && event.ctaHref ? (
                <div className="mt-4">
                  <Button href={event.ctaHref} size="md" variant="secondary">
                    {event.ctaLabel}
                  </Button>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
