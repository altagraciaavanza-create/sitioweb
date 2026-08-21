"use client";

import { useActionState, useEffect, useRef } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import type { ParticipationFormState } from "./actions";

type Option = {
  id?: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
  formId?: string | null;
};

type FormOption = { id: string; name: string };

export function ParticipationForm({
  action,
  option,
  formOptions,
  onSuccess,
}: {
  action: (state: ParticipationFormState, formData: FormData) => Promise<ParticipationFormState>;
  option?: Option;
  formOptions: FormOption[];
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const { toast } = useToast();
  const notified = useRef<ParticipationFormState | null>(null);

  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;

    if (state.success) {
      toast({ variant: "success", title: option?.id ? "Opción actualizada" : "Opción creada" });
      onSuccess?.();
    } else if (state.error) {
      toast({ variant: "danger", title: "No se pudo guardar", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <AdminField label="Título" htmlFor="title" hint='Ej: "Quiero asistir a una reunión"'>
        <AdminInput id="title" name="title" required defaultValue={option?.title} />
      </AdminField>

      <AdminField label="Descripción" htmlFor="description">
        <AdminTextarea
          id="description"
          name="description"
          rows={3}
          required
          defaultValue={option?.description ?? ""}
        />
      </AdminField>

      <AdminField
        label="Al hacer clic, abre este formulario (opcional)"
        htmlFor="formId"
        hint={
          formOptions.length === 0
            ? "Todavía no creaste ningún formulario en /admin/forms. Si no elegís ninguno, la tarjeta queda como texto sin link."
            : "Si no elegís ninguno, la tarjeta queda como texto sin link, igual que antes."
        }
      >
        <select
          id="formId"
          name="formId"
          defaultValue={option?.formId ?? ""}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
        >
          <option value="">Sin formulario (solo texto)</option>
          {formOptions.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </AdminField>

      <AdminField label="Orden" htmlFor="order" hint="Menor número aparece primero.">
        <AdminInput id="order" name="order" type="number" defaultValue={option?.order ?? 0} />
      </AdminField>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={option?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="published" className="text-sm text-fg">
          Publicado (visible en el sitio)
        </label>
      </div>

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar"}
      </AdminButton>
    </form>
  );
}
