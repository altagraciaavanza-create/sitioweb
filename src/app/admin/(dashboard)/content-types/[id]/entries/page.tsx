import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contentTypes, contentEntries } from "@/db/schema";
import { AdminPageHeader, AdminInfoBox } from "@/components/admin/admin-ui";
import { EntriesManager } from "./EntriesManager";
import type { FieldDef } from "@/db/fields";

export default async function ContentEntriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [type] = await db.select().from(contentTypes).where(eq(contentTypes.id, id));
  if (!type) notFound();

  const entries = await db
    .select()
    .from(contentEntries)
    .where(eq(contentEntries.contentTypeId, id))
    .orderBy(asc(contentEntries.order));

  const fields = type.fields as FieldDef[];

  return (
    <div>
      <AdminPageHeader title={type.namePlural} description={type.description ?? undefined} />

      <AdminInfoBox>
        <p>
          Cada entrada de acá abajo es un elemento de &quot;{type.namePlural}&quot; (ej: una nota de prensa, una
          pregunta frecuente). Para que se vean en el sitio, además de cargarlas acá tenés que agregar el
          bloque <strong>&quot;Lista de contenido&quot;</strong> en la página donde querés mostrarlas, y elegir
          ahí el tipo &quot;{type.namePlural}&quot;.
        </p>
        <p>
          Solo se muestran las entradas marcadas como <strong>&quot;Publicado&quot;</strong>. El{" "}
          <strong>orden</strong> controla en qué posición aparece cada una (menor número, primero).
        </p>
      </AdminInfoBox>

      <EntriesManager
        contentTypeId={id}
        entries={entries.map((entry) => ({ ...entry, data: entry.data as Record<string, unknown> }))}
        fields={fields}
        namePlural={type.namePlural}
      />
    </div>
  );
}
