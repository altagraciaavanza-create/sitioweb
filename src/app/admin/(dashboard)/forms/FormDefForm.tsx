"use client";

import { useActionState, useEffect, useRef } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { FieldsBuilder } from "@/components/admin/FieldsBuilder";
import { useToast } from "@/components/ui/Toast";
import type { FormDefFormState } from "./actions";
import type { FieldDef } from "@/db/fields";

type FormDef = {
  name: string;
  slug: string;
  description?: string | null;
  successMessage: string;
  fields: FieldDef[];
};

export function FormDefForm({
  action,
  formDef,
  onSuccess,
}: {
  action: (state: FormDefFormState, formData: FormData) => Promise<FormDefFormState>;
  formDef?: FormDef;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const { toast } = useToast();
  const notified = useRef<FormDefFormState | null>(null);

  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;

    if (state.success) {
      toast({ variant: "success", title: formDef ? "Formulario actualizado" : "Formulario creado" });
      onSuccess?.();
    } else if (state.error) {
      toast({ variant: "danger", title: "No se pudo guardar", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <AdminField label="Nombre" htmlFor="name" hint='Ej: "Inscripción a reunión de barrio"'>
        <AdminInput id="name" name="name" required defaultValue={formDef?.name} />
      </AdminField>

      <AdminField label="Slug" htmlFor="slug" hint="Identificador interno, sin espacios ni tildes.">
        <AdminInput id="slug" name="slug" required defaultValue={formDef?.slug} />
      </AdminField>

      <AdminField label="Descripción (opcional)" htmlFor="description">
        <AdminTextarea id="description" name="description" rows={2} defaultValue={formDef?.description ?? ""} />
      </AdminField>

      <AdminField label="Mensaje de éxito" htmlFor="successMessage" hint="Se muestra después de que alguien lo envía.">
        <AdminInput
          id="successMessage"
          name="successMessage"
          required
          defaultValue={formDef?.successMessage ?? "¡Gracias! Recibimos tu envío."}
        />
      </AdminField>

      <div>
        <p className="text-sm font-medium text-fg">Campos</p>
        <p className="mt-1 text-xs text-fg-muted">Qué le vas a pedir a la persona que lo completa.</p>
        <div className="mt-3">
          <FieldsBuilder initialFields={formDef?.fields ?? []} />
        </div>
      </div>

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar"}
      </AdminButton>
    </form>
  );
}
