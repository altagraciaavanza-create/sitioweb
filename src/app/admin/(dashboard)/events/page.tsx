import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { events } from "@/db/schema";
import { AdminPageHeader, AdminEmpty } from "@/components/admin/admin-ui";
import { EventsManager } from "./EventsManager";

export default async function AdminEventsPage() {
  const items = isDbConfigured ? await db.select().from(events).orderBy(asc(events.startsAt)) : [];

  return (
    <div>
      <AdminPageHeader title="Agenda" description="Próximas actividades y encuentros." />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar la agenda.</AdminEmpty>
      ) : (
        <EventsManager items={items} />
      )}
    </div>
  );
}
