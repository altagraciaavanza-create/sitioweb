import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { topics } from "@/db/schema";
import { AdminPageHeader, AdminEmpty } from "@/components/admin/admin-ui";
import { TopicsManager } from "./TopicsManager";

export default async function AdminTopicsPage() {
  const items = isDbConfigured ? await db.select().from(topics).orderBy(asc(topics.order)) : [];

  return (
    <div>
      <AdminPageHeader
        title="Ideas / ejes temáticos"
        description="Se muestran en /ideas y cada uno tiene su propia página."
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar los ejes temáticos.</AdminEmpty>
      ) : (
        <TopicsManager items={items} />
      )}
    </div>
  );
}
