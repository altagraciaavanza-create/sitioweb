import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { teamMembers } from "@/db/schema";
import { AdminPageHeader, AdminEmpty } from "@/components/admin/admin-ui";
import { TeamManager } from "./TeamManager";

export default async function AdminTeamPage() {
  const members = isDbConfigured
    ? await db.select().from(teamMembers).orderBy(asc(teamMembers.order))
    : [];

  return (
    <div>
      <AdminPageHeader title="Equipo" description="Integrantes que se muestran en /equipo." />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar el equipo.</AdminEmpty>
      ) : (
        <TeamManager items={members} />
      )}
    </div>
  );
}
