"use client";

import { AdminField, AdminInput, AdminButton } from "@/components/admin/admin-ui";
import { updatePageMeta, togglePageStatus } from "./actions";

type Page = {
  id: string;
  slug: string;
  title: string;
  metaDescription: string | null;
  status: "draft" | "published";
};

export function PageMetaForm({ page }: { page: Page }) {
  return (
    <div className="space-y-6">
      <form action={updatePageMeta.bind(null, page.id)} className="flex flex-wrap items-end gap-4">
        <AdminField label="Título" htmlFor="title">
          <AdminInput id="title" name="title" required defaultValue={page.title} className="w-64" />
        </AdminField>
        <AdminField label="Slug" htmlFor="slug" hint='Vacío = home ("/")'>
          <AdminInput id="slug" name="slug" defaultValue={page.slug} className="w-48" />
        </AdminField>
        <AdminField label="Meta descripción" htmlFor="metaDescription">
          <AdminInput
            id="metaDescription"
            name="metaDescription"
            defaultValue={page.metaDescription ?? ""}
            className="w-72"
          />
        </AdminField>
        <AdminButton type="submit" variant="secondary">
          Guardar datos
        </AdminButton>
      </form>

      <form
        action={togglePageStatus.bind(
          null,
          page.id,
          page.slug,
          page.status === "published" ? "draft" : "published"
        )}
      >
        <AdminButton type="submit" variant={page.status === "published" ? "secondary" : "primary"}>
          {page.status === "published" ? "Pasar a borrador" : "Publicar página"}
        </AdminButton>
      </form>
    </div>
  );
}
