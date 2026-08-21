"use client";

import { useActionState, useEffect, useRef } from "react";
import { AdminField, AdminInput, AdminButton } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import { createPage, type PageFormState } from "./actions";

const initialState: PageFormState = {};

export function CreatePageForm() {
  const [state, formAction, pending] = useActionState(createPage, initialState);
  const { toast } = useToast();
  const notified = useRef<PageFormState | null>(null);

  // Si createPage tiene éxito hace redirect() (navega al editor de bloques
  // de la página nueva), así que acá solo nos toca avisar si hubo error.
  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;
    if (state.error) {
      toast({ variant: "danger", title: "No se pudo crear la página", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <AdminField label="Título" htmlFor="title">
        <AdminInput id="title" name="title" required />
      </AdminField>
      <AdminField
        label="Slug"
        htmlFor="slug"
        hint='Dejá vacío para que sea la home ("/"). Ejemplo: "vision" crea /vision.'
      >
        <AdminInput id="slug" name="slug" placeholder="vision" />
      </AdminField>
      <AdminField label="Meta descripción (SEO, opcional)" htmlFor="metaDescription">
        <AdminInput id="metaDescription" name="metaDescription" />
      </AdminField>

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Creando..." : "Crear página"}
      </AdminButton>
    </form>
  );
}
