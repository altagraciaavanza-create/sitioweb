import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { posts } from "@/db/schema";
import { AdminPageHeader, AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { deletePost } from "./actions";

export default async function AdminPostsPage() {
  const items = isDbConfigured ? await db.select().from(posts).orderBy(desc(posts.createdAt)) : [];

  return (
    <div>
      <AdminPageHeader
        title="Actualidad"
        description="Novedades, reuniones y comunicados institucionales."
        action={
          <AdminButton>
            <Link href="/admin/posts/new">Nueva publicación</Link>
          </AdminButton>
        }
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar las publicaciones.</AdminEmpty>
      ) : items.length === 0 ? (
        <AdminEmpty>Todavía no hay publicaciones cargadas.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((post) => (
            <AdminCard key={post.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {post.title}
                  {post.status === "draft" ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">
                      Borrador
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-fg-muted">/actualidad/{post.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/posts/${post.id}`} className="text-sm text-brand-600 hover:underline">
                  Editar
                </Link>
                <form action={deletePost.bind(null, post.id)}>
                  <button type="submit" className="text-sm text-red-600 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
