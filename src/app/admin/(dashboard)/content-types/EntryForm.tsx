"use client";

import { useActionState, useEffect, useRef } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import type { EntryFormState } from "./actions";
import type { FieldDef } from "@/db/fields";

export function EntryForm({
  action,
  fields,
  data,
  order,
  published,
  isEdit,
  onSuccess,
}: {
  action: (state: EntryFormState, formData: FormData) => Promise<EntryFormState>;
  fields: FieldDef[];
  data?: Record<string, unknown>;
  order?: number;
  published?: boolean;
  isEdit?: boolean;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const { toast } = useToast();
  const notified = useRef<EntryFormState | null>(null);

  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;

    if (state.success) {
      toast({ variant: "success", title: isEdit ? "Entrada actualizada" : "Entrada creada" });
      onSuccess?.();
    } else if (state.error) {
      toast({ variant: "danger", title: "No se pudo guardar", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {fields.map((field) => {
        const value = data?.[field.key];
        const labelText = `${field.label}${field.required ? "" : " (opcional)"}`;

        if (field.type === "boolean") {
          return (
            <div key={field.key} className="flex items-center gap-2">
              <input
                id={field.key}
                name={field.key}
                type="checkbox"
                defaultChecked={Boolean(value)}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor={field.key} className="text-sm text-fg">
                {field.label}
              </label>
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <AdminField key={field.key} label={labelText} htmlFor={field.key}>
              <AdminTextarea
                id={field.key}
                name={field.key}
                rows={4}
                required={field.required}
                defaultValue={(value as string) ?? ""}
              />
            </AdminField>
          );
        }

        if (field.type === "select") {
          return (
            <AdminField key={field.key} label={labelText} htmlFor={field.key}>
              <select
                id={field.key}
                name={field.key}
                required={field.required}
                defaultValue={(value as string) ?? ""}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
              >
                <option value="">Seleccioná...</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </AdminField>
          );
        }

        const inputType =
          field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : "text";

        return (
          <AdminField
            key={field.key}
            label={labelText}
            htmlFor={field.key}
            hint={field.type === "image" ? "Pegá una URL de imagen." : undefined}
          >
            <AdminInput
              id={field.key}
              name={field.key}
              type={inputType}
              required={field.required}
              defaultValue={(value as string | number | undefined) ?? ""}
            />
          </AdminField>
        );
      })}

      <AdminField label="Orden" htmlFor="order" hint="Menor número aparece primero.">
        <AdminInput id="order" name="order" type="number" defaultValue={order ?? 0} />
      </AdminField>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={published ?? true}
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
