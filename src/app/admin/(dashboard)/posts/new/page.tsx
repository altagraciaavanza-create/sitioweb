import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { PostForm } from "../PostForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <AdminPageHeader title="Nueva publicación" />
      <AdminCard className="max-w-2xl">
        <PostForm action={createPost} />
      </AdminCard>
    </div>
  );
}
