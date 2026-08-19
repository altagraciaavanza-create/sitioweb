import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { TeamMemberForm } from "../TeamMemberForm";
import { updateTeamMember } from "../actions";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));

  if (!member) notFound();

  return (
    <div>
      <AdminPageHeader title={`Editar: ${member.name}`} />
      <AdminCard className="max-w-xl">
        <TeamMemberForm action={updateTeamMember.bind(null, id)} member={member} />
      </AdminCard>
    </div>
  );
}
