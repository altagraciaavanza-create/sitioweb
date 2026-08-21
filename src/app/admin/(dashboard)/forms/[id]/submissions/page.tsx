import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import { AdminPageHeader, AdminEmpty, AdminInfoBox } from "@/components/admin/admin-ui";
import { SubmissionRow } from "./SubmissionRow";
import { MarkAllReadButton } from "./MarkAllReadButton";
import type { FieldDef } from "@/db/fields";

export default async function FormSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [formDef] = await db.select().from(forms).where(eq(forms.id, id));
  if (!formDef) notFound();

  const submissions = await db
    .select()
    .from(formSubmissions)
    .where(eq(formSubmissions.formId, id))
    .orderBy(desc(formSubmissions.createdAt));

  const fields = formDef.fields as FieldDef[];
  const unreadCount = submissions.filter((s) => !s.readAt).length;

  return (
    <div>
      <AdminPageHeader
        title={`Respuestas: ${formDef.name}`}
        description={`${submissions.length} respuesta(s)${unreadCount ? ` · ${unreadCount} sin leer` : ""}`}
        action={<MarkAllReadButton formId={id} disabled={unreadCount === 0} />}
      />

      <AdminInfoBox>
        <p>
          Esta es la bandeja de entrada de este formulario: cada respuesta nueva aparece marcada con un
          punto y fondo destacado hasta que la abrís. No se envía ningún mail automático — para enterarte de
          respuestas nuevas tenés que entrar a revisar esta página; el número en &quot;Respuestas&quot; de la
          lista de formularios te muestra cuántas hay sin leer.
        </p>
      </AdminInfoBox>

      {submissions.length === 0 ? (
        <AdminEmpty>Todavía no hay respuestas.</AdminEmpty>
      ) : (
        <div className="space-y-2">
          {submissions.map((sub) => (
            <SubmissionRow
              key={sub.id}
              formId={id}
              fields={fields}
              submission={{
                id: sub.id,
                createdAt: sub.createdAt.toISOString(),
                readAt: sub.readAt ? sub.readAt.toISOString() : null,
                data: sub.data as Record<string, unknown>,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
