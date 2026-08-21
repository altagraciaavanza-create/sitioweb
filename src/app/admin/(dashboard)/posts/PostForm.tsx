"use client";

import { useActionState, useEffect, useRef } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import type { PostFormState } from "./actions";

const categories = [
  ["reuniones", "Reunión"],
  ["actividades", "Actividad"],
  ["documentos", "Documento"],
  ["propuestas", "Propuesta"],
  ["comunicados", "Comunicado"],
  ["recorridas", "Recorrida"],
  ["posiciones_institucionales", "Posición institucional"],
] as const;

type Post = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string | null;
  category: string;
  coverImageUrl?: string | null;
  status: string;
  publishedAt?: Date | string | null;
};

export function PostForm({
  action,
  post,
  onSuccess,
}: {
  action: (state: PostFormState, formData: FormData) => Promise<PostFormState>;
  post?: Post;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const { toast } = useToast();
  const notified = useRef<PostFormState | null>(null);
  const publishedAtValue = post?.publishedAt
    ? new Date(post.publishedAt).toISOString().slice(0, 10)
    : "";

  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;

    if (state.success) {
      toast({ variant: "success", title: post?.id ? "Publicación actualizada" : "Publicación creada" });
      onSuccess?.();
    } else if (state.error) {
      toast({ variant: "danger", title: "No se pudo guardar", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <AdminField label="Slug" htmlFor="slug" hint="Se usa en la URL: /actualidad/tu-slug">
        <AdminInput id="slug" name="slug" required defaultValue={post?.slug} />
      </AdminField>

      <AdminField label="Título" htmlFor="title">
        <AdminInput id="title" name="title" required defaultValue={post?.title} />
      </AdminField>

      <AdminField label="Resumen (para las tarjetas)" htmlFor="excerpt">
        <AdminTextarea id="excerpt" name="excerpt" rows={2} required defaultValue={post?.excerpt} />
      </AdminField>

      <AdminField label="Cuerpo completo (opcional, markdown)" htmlFor="body">
        <AdminTextarea id="body" name="body" rows={8} defaultValue={post?.body ?? ""} />
      </AdminField>

      <AdminField label="Categoría" htmlFor="category">
        <select
          id="category"
          name="category"
          defaultValue={post?.category ?? "comunicados"}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
        >
          {categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </AdminField>

      <AdminField label="Imagen de portada (URL, opcional)" htmlFor="coverImageUrl">
        <AdminInput id="coverImageUrl" name="coverImageUrl" defaultValue={post?.coverImageUrl ?? ""} />
      </AdminField>

      <AdminField label="Estado" htmlFor="status">
        <select
          id="status"
          name="status"
          defaultValue={post?.status ?? "draft"}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
        >
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
      </AdminField>

      <AdminField
        label="Fecha de publicación"
        htmlFor="publishedAt"
        hint="Si la dejás vacía y publicás, se usa la fecha de hoy."
      >
        <AdminInput id="publishedAt" name="publishedAt" type="date" defaultValue={publishedAtValue} />
      </AdminField>

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar"}
      </AdminButton>
    </form>
  );
}
