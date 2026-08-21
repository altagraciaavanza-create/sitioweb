import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { pages } from "@/db/schema";
import { AdminPageHeader, AdminEmpty } from "@/components/admin/admin-ui";
import { PagesManager } from "./PagesManager";

export default async function AdminPagesPage() {
  const items = isDbConfigured ? await db.select().from(pages).orderBy(asc(pages.createdAt)) : [];

  return (
    <div>
      <AdminPageHeader
        title="Páginas"
        description="Armá cada página combinando y ordenando bloques de contenido."
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar páginas.</AdminEmpty>
      ) : (
        <PagesManager items={items} />
      )}
    </div>
  );
}
