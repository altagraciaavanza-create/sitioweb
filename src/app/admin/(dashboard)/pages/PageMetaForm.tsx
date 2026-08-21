"use client";

import { useTransition } from "react";
import { AdminField, AdminInput, AdminButton } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import { updatePageMeta, togglePageStatus } from "./actions";

type Page = {
  id: string;
  slug: string;
  title: string;
  metaDescription: string | null;
  status: "draft" | "published";
};

export function PageMetaForm({ page }: { page: Page }) {
  const [savingMeta, startSavingMeta] = useTransition();
  const [togglingStatus, startTogglingStatus] = useTransition();
  const { toast } = useToast();

  function handleMetaSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startSavingMeta(async () => {
      await updatePageMeta(page.id, formData);
      toast({ variant: "success", title: "Datos guardados" });
    });
  }

  function handleToggleStatus() {
    const nextStatus = page.status === "published" ? "draft" : "published";
    startTogglingStatus(async () => {
      await togglePageStatus(page.id, page.slug, nextStatus);
      toast({
        variant: "success",
        title: nextStatus === "published" ? "Página publicada" : "Página pasada a borrador",
      });
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleMetaSubmit} className="flex flex-wrap items-end gap-4">
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
        <AdminButton type="submit" variant="secondary" disabled={savingMeta}>
          {savingMeta ? "Guardando..." : "Guardar datos"}
        </AdminButton>
      </form>

      <AdminButton
        type="button"
        onClick={handleToggleStatus}
        disabled={togglingStatus}
        variant={page.status === "published" ? "secondary" : "primary"}
      >
        {togglingStatus
          ? "Guardando..."
          : page.status === "published"
            ? "Pasar a borrador"
            : "Publicar página"}
      </AdminButton>
    </div>
  );
}
