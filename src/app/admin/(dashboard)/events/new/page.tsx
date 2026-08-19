import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { EventForm } from "../EventForm";
import { createEvent } from "../actions";

export default function NewEventPage() {
  return (
    <div>
      <AdminPageHeader title="Nuevo evento" />
      <AdminCard className="max-w-xl">
        <EventForm action={createEvent} />
      </AdminCard>
    </div>
  );
}
