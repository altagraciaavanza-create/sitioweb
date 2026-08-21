import { eq } from "drizzle-orm";
import { Section } from "@/components/ui/Section";
import { db, isDbConfigured } from "@/db";
import { forms } from "@/db/schema";
import { FormBlockModal } from "./FormBlockModal";
import type { BlockContent } from "@/db/blocks";
import type { FieldDef } from "@/db/fields";

export async function FormBlock({ content }: { content: BlockContent<"form"> }) {
  if (!isDbConfigured || !content.formId) return null;

  const [formDef] = await db.select().from(forms).where(eq(forms.id, content.formId));
  if (!formDef) return null;

  const heading = content.title || formDef.name;
  const description = content.description || formDef.description;

  return (
    <Section tone="default">
      <div className="mx-auto max-w-xl text-center">
        {heading ? <h2 className="text-2xl font-bold text-fg md:text-3xl">{heading}</h2> : null}
        {description ? <p className="mt-2 text-sm text-fg-muted">{description}</p> : null}
        <div className="mt-6">
          <FormBlockModal
            buttonLabel={heading || "Completar formulario"}
            modalTitle={formDef.name}
            modalDescription={formDef.description}
            formId={formDef.id}
            fields={formDef.fields as FieldDef[]}
            successMessage={formDef.successMessage}
          />
        </div>
      </div>
    </Section>
  );
}
