import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedTeamMembers } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { buildWhatsappLink } from "@/lib/utils";

export const metadata = buildMetadata({
  path: "/equipo",
  title: "Equipo",
  description: "Conocé a las personas que forman parte de Alta Gracia Avanza.",
});

export default async function EquipoPage() {
  const members = await getPublishedTeamMembers();

  return (
    <Section tone="default">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          Equipo
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Las personas que forman parte de Alta Gracia Avanza.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="Próximamente"
            description="Estamos preparando las presentaciones del equipo. Volvé pronto para conocer a quienes forman parte del espacio."
          />
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id} className="text-center">
              {member.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto h-24 w-24 rounded-full bg-bg-subtle" aria-hidden="true" />
              )}
              <h2 className="mt-4 text-base font-semibold text-fg">{member.name}</h2>
              {member.activity ? (
                <p className="text-sm text-fg-muted">{member.activity}</p>
              ) : null}
              {member.whyParticipate ? (
                <p className="mt-3 text-sm italic text-fg-muted">
                  &ldquo;{member.whyParticipate}&rdquo;
                </p>
              ) : null}
              {member.whatsappNumber ? (
                <a
                  href={buildWhatsappLink(
                    member.whatsappNumber,
                    `Hola ${member.name.split(" ")[0]}, te escribo por Alta Gracia Avanza.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.32 4.95L2 22l5.2-1.36a9.96 9.96 0 0 0 4.84 1.24h.01c5.52 0 10-4.48 10-10s-4.49-9.88-10.01-9.88Zm0 18.16h-.01a8.16 8.16 0 0 1-4.16-1.14l-.3-.18-3.09.81.82-3-.19-.31a8.18 8.18 0 0 1-1.26-4.35c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.86 5.79 2.4a8.13 8.13 0 0 1 2.4 5.8c0 4.52-3.68 8.17-8.2 8.17Zm4.5-6.14c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28Z" />
                  </svg>
                  Escribime
                </a>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
