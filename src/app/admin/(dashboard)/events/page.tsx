import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { events } from "@/db/schema";
import { AdminPageHeader, AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { formatDate } from "@/lib/utils";
import { deleteEvent } from "./actions";

export default async function AdminEventsPage() {
  const items = isDbConfigured ? await db.select().from(events).orderBy(asc(events.startsAt)) : [];

  return (
    <div>
      <AdminPageHeader
        title="Agenda"
        description="Próximas actividades y encuentros."
        action={
          <AdminButton>
            <Link href="/admin/events/new">Nuevo evento</Link>
          </AdminButton>
        }
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar la agenda.</AdminEmpty>
      ) : items.length === 0 ? (
        <AdminEmpty>Todavía no hay eventos cargados.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((event) => (
            <AdminCard key={event.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {event.title}
                  {!event.published ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">
                      Oculto
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-fg-muted">
                  {formatDate(new Date(event.startsAt).toISOString())}
                  {event.location ? ` · ${event.location}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/events/${event.id}`} className="text-sm text-brand-600 hover:underline">
                  Editar
                </Link>
                <form action={deleteEvent.bind(null, event.id)}>
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
