import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/db";
import { pages, pageBlocks, contentTypes, forms } from "@/db/schema";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { PageMetaForm } from "../PageMetaForm";
import { AddBlockForm } from "../AddBlockForm";
import { BlockList } from "../BlockList";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [page] = await db.select().from(pages).where(eq(pages.id, id));
  if (!page) notFound();

  const blocks = await db
    .select()
    .from(pageBlocks)
    .where(eq(pageBlocks.pageId, id))
    .orderBy(asc(pageBlocks.order));

  // Para los bloques "Lista de contenido" y "Formulario", que referencian
  // un tipo de contenido / formulario por id.
  const [contentTypeOptions, formOptions] = await Promise.all([
    db.select({ id: contentTypes.id, name: contentTypes.namePlural }).from(contentTypes),
    db.select({ id: forms.id, name: forms.name }).from(forms),
  ]);

  return (
    <div>
      <AdminPageHeader
        title={page.title}
        description={page.slug === "" ? "/" : `/${page.slug}`}
      />

      <AdminCard className="mb-8">
        <PageMetaForm page={page} />
      </AdminCard>

      <h2 className="mb-3 text-sm font-semibold text-fg">Bloques de la página</h2>
      <BlockList
        pageId={id}
        slug={page.slug}
        blocks={blocks.map((b) => ({
          id: b.id,
          type: b.type,
          content: b.content as Record<string, unknown>,
        }))}
        contentTypeOptions={contentTypeOptions}
        formOptions={formOptions}
      />

      <div className="mt-6">
        <AddBlockForm pageId={id} slug={page.slug} />
      </div>
    </div>
  );
}
