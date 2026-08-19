import { eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { siteSettings } from "@/db/schema";
import { AdminPageHeader, AdminCard, AdminEmpty } from "@/components/admin/admin-ui";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = isDbConfigured
    ? (await db.select().from(siteSettings).where(eq(siteSettings.id, 1)))[0] ?? null
    : null;

  return (
    <div>
      <AdminPageHeader
        title="Configuración del sitio"
        description="Datos institucionales y de contacto. Nunca se hardcodean en los componentes."
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para editar la configuración.</AdminEmpty>
      ) : (
        <AdminCard>
          <SettingsForm settings={settings} />
        </AdminCard>
      )}
    </div>
  );
}
