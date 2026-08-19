import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { pages } from "@/db/schema";
import { AdminPageHeader, AdminCard, AdminEmpty } from "@/components/admin/admin-ui";
import { CreatePageForm } from "./CreatePageForm";

export default async function AdminPagesPage() {
  const items = isDbConfigured ? await db.select().from(pages).orderBy(asc(pages.createdAt)) : [];

  return (
    <div>
      <AdminPageHeader
        title="Páginas"
        description="Armá cada página combinando y ordenando bloques de contenido."
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar páginas.</AdminEmpty>
      ) : (
        <>
          {items.length === 0 ? (
            <AdminEmpty>Todavía no hay páginas creadas.</AdminEmpty>
          ) : (
            <div className="space-y-3">
              {items.map((page) => (
                <AdminCard key={page.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-fg">
                      {page.title}
                      <span
                        className={
                          "ml-2 rounded-full px-2 py-0.5 text-xs " +
                          (page.status === "published"
                            ? "bg-brand-50 text-brand-700"
                            : "bg-bg-subtle text-fg-muted")
                        }
                      >
                        {page.status === "published" ? "Publicada" : "Borrador"}
                      </span>
                    </p>
                    <p className="text-xs text-fg-muted">{page.slug === "" ? "/" : `/${page.slug}`}</p>
                  </div>
                  <Link href={`/admin/pages/${page.id}`} className="text-sm text-brand-600 hover:underline">
                    Editar
                  </Link>
                </AdminCard>
              ))}
            </div>
          )}

          <AdminCard className="mt-8 max-w-xl">
            <h2 className="text-sm font-semibold text-fg">Nueva página</h2>
            <div className="mt-4">
              <CreatePageForm />
            </div>
          </AdminCard>
        </>
      )}
    </div>
  );
}
