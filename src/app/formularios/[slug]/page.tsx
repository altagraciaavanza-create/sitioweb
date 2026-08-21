import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { forms } from "@/db/schema";
import { Section } from "@/components/ui/Section";
import { PublicDynamicForm } from "@/components/forms/PublicDynamicForm";
import { buildMetadata } from "@/lib/metadata";
import type { FieldDef } from "@/db/fields";

async function getFormBySlug(slug: string) {
  if (!isDbConfigured) return null;
  const [formDef] = await db.select().from(forms).where(eq(forms.slug, slug));
  return formDef ?? null;
}

export async function generateMetadata(props: PageProps<"/formularios/[slug]">) {
  const { slug } = await props.params;
  const formDef = await getFormBySlug(slug);
  if (!formDef) return buildMetadata({ path: `/formularios/${slug}` });
  return buildMetadata({
    path: `/formularios/${formDef.slug}`,
    title: formDef.name,
    description: formDef.description ?? undefined,
  });
}

export default async function PublicFormPage(props: PageProps<"/formularios/[slug]">) {
  const { slug } = await props.params;
  const formDef = await getFormBySlug(slug);

  if (!formDef) notFound();

  return (
    <Section tone="default">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-fg md:text-4xl">{formDef.name}</h1>
        {formDef.description ? <p className="mt-3 text-fg-muted">{formDef.description}</p> : null}
        <div className="mt-8">
          <PublicDynamicForm
            formId={formDef.id}
            fields={formDef.fields as FieldDef[]}
            successMessage={formDef.successMessage}
          />
        </div>
      </div>
    </Section>
  );
}
