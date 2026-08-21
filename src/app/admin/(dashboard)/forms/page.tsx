import { asc, count, isNull } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import { AdminPageHeader, AdminEmpty, AdminInfoBox } from "@/components/admin/admin-ui";
import { FormsManager } from "./FormsManager";
import type { FieldDef } from "@/db/fields";

export default async function AdminFormsPage() {
  const items = isDbConfigured ? await db.select().from(forms).orderBy(asc(forms.name)) : [];

  const unreadRows = isDbConfigured
    ? await db
        .select({ formId: formSubmissions.formId, count: count() })
        .from(formSubmissions)
        .where(isNull(formSubmissions.readAt))
        .groupBy(formSubmissions.formId)
    : [];
  const unreadByForm = new Map(unreadRows.map((r) => [r.formId, r.count]));

  return (
    <div>
      <AdminPageHeader
        title="Formularios"
        description="Formularios que los vecinos pueden completar desde el sitio (encuestas, inscripciones, contacto, etc.). Insertalos en cualquier página con el bloque 'Formulario'."
      />

      <AdminInfoBox title="¿Para qué sirve esto y cómo se usa?">
        <p>
          Un <strong>formulario</strong> define qué le vas a preguntar a un vecino (nombre, email, a qué
          actividad se anota, etc.). Cuando alguien lo completa desde el sitio, la respuesta queda guardada
          acá y la podés consultar cuando quieras — no llega por mail, hay que entrar a &quot;Respuestas&quot;.
        </p>
        <p>Ejemplo: para armar un formulario de inscripción a una actividad, el flujo es:</p>
        <ol>
          <li>
            Tocá <strong>&quot;Nuevo formulario&quot;</strong> y definí sus campos (ej: nombre, teléfono,
            actividad) y el mensaje que ve la persona después de enviarlo.
          </li>
          <li>
            Andá a <strong>Páginas</strong>, elegí la página donde querés que aparezca, agregá un bloque{" "}
            <strong>&quot;Formulario&quot;</strong> y elegí el que creaste. Ya queda visible en el sitio.
          </li>
          <li>
            Cada vez que alguien lo complete, vas a poder verlo entrando a{" "}
            <strong>&quot;Respuestas&quot;</strong> de ese formulario.
          </li>
        </ol>
        <p>Podés crear varios formularios distintos (contacto, encuesta, inscripción, etc.) y usarlos en páginas diferentes.</p>
      </AdminInfoBox>

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar formularios.</AdminEmpty>
      ) : (
        <FormsManager
          items={items.map((f) => ({
            ...f,
            fields: f.fields as FieldDef[],
            unreadCount: unreadByForm.get(f.id) ?? 0,
          }))}
        />
      )}
    </div>
  );
}
