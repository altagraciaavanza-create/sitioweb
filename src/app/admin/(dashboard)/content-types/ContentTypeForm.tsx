"use client";

import { useActionState, useEffect, useRef } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { FieldsBuilder } from "@/components/admin/FieldsBuilder";
import { useToast } from "@/components/ui/Toast";
import type { ContentTypeFormState } from "./actions";
import type { FieldDef } from "@/db/fields";

type ContentType = {
  id?: string;
  name: string;
  namePlural: string;
  slug: string;
  description?: string | null;
  fields: FieldDef[];
};

export function ContentTypeForm({
  action,
  contentType,
  onSuccess,
}: {
  action: (state: ContentTypeFormState, formData: FormData) => Promise<ContentTypeFormState>;
  contentType?: ContentType;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const { toast } = useToast();
  const notified = useRef<ContentTypeFormState | null>(null);

  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;

    if (state.success) {
      toast({ variant: "success", title: contentType?.id ? "Tipo actualizado" : "Tipo creado" });
      onSuccess?.();
    } else if (state.error) {
      toast({ variant: "danger", title: "No se pudo guardar", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <AdminField label="Nombre (singular)" htmlFor="name" hint='Ej: "Nota de prensa"'>
        <AdminInput id="name" name="name" required defaultValue={contentType?.name} />
      </AdminField>

      <AdminField label="Nombre (plural)" htmlFor="namePlural" hint='Ej: "Prensa"'>
        <AdminInput id="namePlural" name="namePlural" required defaultValue={contentType?.namePlural} />
      </AdminField>

      <AdminField
        label="Slug"
        htmlFor="slug"
        hint="Identificador interno, sin espacios ni tildes. Evitá cambiarlo después de crear entradas."
      >
        <AdminInput id="slug" name="slug" required defaultValue={contentType?.slug} />
      </AdminField>

      <AdminField label="Descripción (opcional)" htmlFor="description">
        <AdminTextarea id="description" name="description" rows={2} defaultValue={contentType?.description ?? ""} />
      </AdminField>

      <div>
        <p className="text-sm font-medium text-fg">Campos</p>
        <p className="mt-1 text-xs text-fg-muted">
          Definí qué información va a tener cada entrada de este tipo. El primer campo se usa como título en
          los listados.
        </p>
        <div className="mt-3">
          <FieldsBuilder initialFields={contentType?.fields ?? []} />
        </div>
      </div>

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar"}
      </AdminButton>
    </form>
  );
}
