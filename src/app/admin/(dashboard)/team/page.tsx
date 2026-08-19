import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { teamMembers } from "@/db/schema";
import { AdminPageHeader, AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { deleteTeamMember } from "./actions";

export default async function AdminTeamPage() {
  const members = isDbConfigured
    ? await db.select().from(teamMembers).orderBy(asc(teamMembers.order))
    : [];

  return (
    <div>
      <AdminPageHeader
        title="Equipo"
        description="Integrantes que se muestran en /equipo."
        action={
          <AdminButton>
            <Link href="/admin/team/new">Nuevo integrante</Link>
          </AdminButton>
        }
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar el equipo.</AdminEmpty>
      ) : members.length === 0 ? (
        <AdminEmpty>Todavía no hay integrantes cargados.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <AdminCard key={member.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {member.name}
                  {!member.published ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">
                      Borrador
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-fg-muted">{member.activity}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/team/${member.id}`} className="text-sm text-brand-600 hover:underline">
                  Editar
                </Link>
                <form action={deleteTeamMember.bind(null, member.id)}>
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
