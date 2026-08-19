import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublishedTeamMembers } from "@/lib/content";
import type { BlockContent } from "@/db/blocks";

export async function TeamGridBlock({ content }: { content: BlockContent<"team_grid"> }) {
  const { title, description } = content;
  const members = await getPublishedTeamMembers();

  return (
    <Section tone="default">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
          {title}
        </h2>
        {description ? <p className="mt-3 text-lg text-fg-muted">{description}</p> : null}
      </div>

      {members.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="Próximamente"
            description="Estamos preparando las presentaciones del equipo."
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
              <h3 className="mt-4 text-base font-semibold text-fg">{member.name}</h3>
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
