import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { TopicForm } from "../TopicForm";
import { createTopic } from "../actions";

export default function NewTopicPage() {
  return (
    <div>
      <AdminPageHeader title="Nuevo eje temático" />
      <AdminCard className="max-w-xl">
        <TopicForm action={createTopic} />
      </AdminCard>
    </div>
  );
}
