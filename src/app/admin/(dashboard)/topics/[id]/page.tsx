import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { topics } from "@/db/schema";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { TopicForm } from "../TopicForm";
import { updateTopic } from "../actions";

export default async function EditTopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [topic] = await db.select().from(topics).where(eq(topics.id, id));

  if (!topic) notFound();

  return (
    <div>
      <AdminPageHeader title={`Editar: ${topic.title}`} />
      <AdminCard className="max-w-xl">
        <TopicForm action={updateTopic.bind(null, id)} topic={topic} />
      </AdminCard>
    </div>
  );
}
