import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { participationOptions, forms } from "@/db/schema";
import { AdminPageHeader, AdminEmpty, AdminInfoBox } from "@/components/admin/admin-ui";
import { ParticipationManager } from "./ParticipationManager";

export default async function AdminParticipationPage() {
  const [items, formOptions] = isDbConfigured
    ? await Promise.all([
        db.select().from(participationOptions).orderBy(asc(participationOptions.order)),
        db.select({ id: forms.id, name: forms.name }).from(forms),
      ])
    : [[], []];

  return (
    <div>
      <AdminPageHeader title="Participá" description="Las opciones de participación que se muestran en /participa." />

      <AdminInfoBox>
        <p>
          Cada tarjeta de la página /participa puede, opcionalmente, abrir uno de los formularios que armaste
          en <strong>/admin/forms</strong> al hacer clic (ej: &quot;Quiero colaborar&quot; abre el formulario
          de inscripción como voluntario). Si una opción no tiene formulario asignado, se muestra solo como
          texto, igual que antes.
        </p>
      </AdminInfoBox>

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar las opciones de participación.</AdminEmpty>
      ) : (
        <ParticipationManager items={items} formOptions={formOptions} />
      )}
    </div>
  );
}
