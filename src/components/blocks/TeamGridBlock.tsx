import type { CSSProperties } from "react";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { EditableText } from "@/components/editing/EditableText";
import { ContainerStyleTrigger } from "@/components/editing/ContainerStyleTrigger";
import { updateBlockContainerStyle } from "@/app/actions/editable-blocks";
import { getPublishedTeamMembers } from "@/lib/content";
import type { BlockContent } from "@/db/blocks";

export async function TeamGridBlock({ id, content }: { id: string; content: BlockContent<"team_grid"> }) {
  const { title, description, containerStyle = {} } = content;
  const members = await getPublishedTeamMembers();
  const sectionStyle: CSSProperties = {
    backgroundColor: containerStyle.background,
    paddingTop: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    paddingBottom: containerStyle.padding != null ? `${containerStyle.padding}px` : undefined,
    marginTop: containerStyle.marginTop != null ? `${containerStyle.marginTop}px` : undefined,
    marginBottom: containerStyle.marginBottom != null ? `${containerStyle.marginBottom}px` : undefined,
  };

  return (
    <Section tone="default" style={sectionStyle}>
      <ContainerStyleTrigger
        label="Sección de equipo"
        value={containerStyle}
        supports={{ background: true, padding: true, margin: true }}
        onSave={updateBlockContainerStyle.bind(null, id)}
      />
      <div className="mx-auto max-w-2xl text-center">
        <EditableText
          blockId={id}
          field="title"
          value={title}
          as="h2"
          className="text-3xl font-bold tracking-tight text-fg md:text-4xl"
        />
        {description ? (
          <EditableText
            blockId={id}
            field="description"
            value={description}
            as="p"
            className="mt-3 text-lg text-fg-muted"
            multiline
          />
        ) : null}
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
