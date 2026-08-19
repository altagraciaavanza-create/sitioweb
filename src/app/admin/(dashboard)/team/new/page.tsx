import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { TeamMemberForm } from "../TeamMemberForm";
import { createTeamMember } from "../actions";

export default function NewTeamMemberPage() {
  return (
    <div>
      <AdminPageHeader title="Nuevo integrante" />
      <AdminCard className="max-w-xl">
        <TeamMemberForm action={createTeamMember} />
      </AdminCard>
    </div>
  );
}
