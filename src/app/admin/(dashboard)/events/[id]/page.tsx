import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { EventForm } from "../EventForm";
import { updateEvent } from "../actions";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event] = await db.select().from(events).where(eq(events.id, id));

  if (!event) notFound();

  return (
    <div>
      <AdminPageHeader title={`Editar: ${event.title}`} />
      <AdminCard className="max-w-xl">
        <EventForm action={updateEvent.bind(null, id)} event={event} />
      </AdminCard>
    </div>
  );
}
