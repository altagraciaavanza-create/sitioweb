import { and, asc, eq } from "drizzle-orm";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { db, isDbConfigured } from "@/db";
import { contentTypes, contentEntries } from "@/db/schema";
import type { BlockContent } from "@/db/blocks";
import type { FieldDef } from "@/db/fields";

export async function ContentListBlock({ content }: { content: BlockContent<"content_list"> }) {
  if (!isDbConfigured || !content.contentTypeId) return null;

  const [type] = await db.select().from(contentTypes).where(eq(contentTypes.id, content.contentTypeId));
  if (!type) return null;

  const entries = await db
    .select()
    .from(contentEntries)
    .where(and(eq(contentEntries.contentTypeId, content.contentTypeId), eq(contentEntries.published, true)))
    .orderBy(asc(contentEntries.order));

  const fields = type.fields as FieldDef[];
  const titleField = fields[0];
  const restFields = fields.slice(1);

  return (
    <Section tone="default">
      {content.title || content.description ? (
        <div className="mx-auto max-w-2xl text-center">
          {content.title ? (
            <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">{content.title}</h2>
          ) : null}
          {content.description ? <p className="mt-3 text-fg-muted">{content.description}</p> : null}
        </div>
      ) : null}

      {entries.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Próximamente" description="Todavía no hay contenido publicado acá." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const data = entry.data as Record<string, unknown>;
            return (
              <Card key={entry.id}>
                {titleField ? (
                  <h3 className="text-base font-semibold text-fg">{String(data[titleField.key] ?? "")}</h3>
                ) : null}
                {restFields.map((field) => {
                  const value = data[field.key];
                  if (value === null || value === undefined || value === "") return null;
                  if (field.type === "image") {
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={field.key}
                        src={String(value)}
                        alt=""
                        className="mt-3 h-32 w-full rounded-md object-cover"
                      />
                    );
                  }
                  if (field.type === "boolean") return null;
                  return (
                    <p key={field.key} className="mt-2 text-sm text-fg-muted">
                      {String(value)}
                    </p>
                  );
                })}
              </Card>
            );
          })}
        </div>
      )}
    </Section>
  );
}
