"use client";

import { useActionState } from "react";
import { AdminField, AdminInput, AdminButton } from "@/components/admin/admin-ui";
import { createPage, type PageFormState } from "./actions";

const initialState: PageFormState = {};

export function CreatePageForm() {
  const [state, formAction, pending] = useActionState(createPage, initialState);

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

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Creando..." : "Crear página"}
      </AdminButton>
    </form>
  );
}
