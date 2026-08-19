import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { topics } from "@/db/schema";
import { AdminPageHeader, AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { deleteTopic } from "./actions";

export default async function AdminTopicsPage() {
  const items = isDbConfigured ? await db.select().from(topics).orderBy(asc(topics.order)) : [];

  return (
    <div>
      <AdminPageHeader
        title="Ideas / ejes temáticos"
        description="Se muestran en /ideas y cada uno tiene su propia página."
        action={
          <AdminButton>
            <Link href="/admin/topics/new">Nuevo eje</Link>
          </AdminButton>
        }
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar los ejes temáticos.</AdminEmpty>
      ) : items.length === 0 ? (
        <AdminEmpty>Todavía no hay ejes cargados.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((topic) => (
            <AdminCard key={topic.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {topic.title}
                  {!topic.published ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">
                      Borrador
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-fg-muted">/ideas/{topic.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/topics/${topic.id}`} className="text-sm text-brand-600 hover:underline">
                  Editar
                </Link>
                <form action={deleteTopic.bind(null, topic.id)}>
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
