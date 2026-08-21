import { desc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { posts } from "@/db/schema";
import { AdminPageHeader, AdminEmpty } from "@/components/admin/admin-ui";
import { PostsManager } from "./PostsManager";

export default async function AdminPostsPage() {
  const items = isDbConfigured ? await db.select().from(posts).orderBy(desc(posts.createdAt)) : [];

  return (
    <div>
      <AdminPageHeader
        title="Actualidad"
        description="Novedades, reuniones y comunicados institucionales."
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar las publicaciones.</AdminEmpty>
      ) : (
        <PostsManager items={items} />
      )}
    </div>
  );
}
