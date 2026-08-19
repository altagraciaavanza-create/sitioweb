import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedTeamMembers } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

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
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}
