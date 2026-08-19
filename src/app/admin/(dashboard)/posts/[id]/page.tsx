import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { PostForm } from "../PostForm";
import { updatePost } from "../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.id, id));

  if (!post) notFound();

  return (
    <div>
      <AdminPageHeader title={`Editar: ${post.title}`} />
      <AdminCard className="max-w-2xl">
        <PostForm action={updatePost.bind(null, id)} post={post} />
      </AdminCard>
    </div>
  );
}
