"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { submitPublicForm, type PublicFormState } from "./actions";
import type { FieldDef } from "@/db/fields";

/**
 * Los campos de teléfono/WhatsApp que carga un vecino en un formulario
 * público (a diferencia del WhatsApp institucional de Configuración o
 * Equipo, que se usa para armar un link wa.me) son solo un dato de
 * contacto: alcanza con el formato habitual argentino "código de área +
 * número", sin 0 ni 15.
 */
const PHONE_FIELD_PATTERN = /tel[eé]fono|whatsapp|celular/i;
const PHONE_PLACEHOLDER = "3547 312015";
const PHONE_HINT = "Código de área + número, sin 0 ni 15 (ej: 3547 312015).";
const PHONE_INPUT_PATTERN = "^[0-9()+\\-\\s]{6,20}$";

function isPhoneField(field: FieldDef): boolean {
  return field.type === "text" && PHONE_FIELD_PATTERN.test(field.label);
}

export function PublicDynamicForm({
  formId,
  fields,
  successMessage,
  onSuccess,
}: {
  formId: string;
  fields: FieldDef[];
  successMessage: string;
  /** Se llama cuando el envío se confirma (útil para cerrar un modal). */
  onSuccess?: () => void;
}) {
  const action = submitPublicForm.bind(null, formId);
  const [state, formAction, pending] = useActionState<PublicFormState, FormData>(action, {});
  const { toast } = useToast();
  const notified = useRef<PublicFormState | null>(null);

  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;

    if (state.success) {
      toast({ variant: "success", title: "¡Listo!", description: successMessage });
      onSuccess?.();
    } else if (state.error) {
      toast({ variant: "danger", title: "No se pudo enviar", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state.success) {
    return (
      <div className="rounded-lg border border-brand-300 bg-brand-50 p-6 text-brand-700">
        {successMessage}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {fields.map((field) => {
        if (field.type === "boolean") {
          return (
            <div key={field.key} className="flex items-center gap-2">
              <input
                id={field.key}
                name={field.key}
                type="checkbox"
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
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-fg">
                {field.label}
                {field.required ? "" : " (opcional)"}
              </label>
              <textarea
                id={field.key}
                name={field.key}
                rows={4}
                required={field.required}
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-500"
              />
            </div>
          );
        }

        if (field.type === "select") {
          return (
            <div key={field.key}>
              <label htmlFor={field.key} className="block text-sm font-medium text-fg">
                {field.label}
                {field.required ? "" : " (opcional)"}
              </label>
              <select
                id={field.key}
                name={field.key}
                required={field.required}
                defaultValue=""
                className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-500"
              >
                <option value="" disabled>
                  Seleccioná...
                </option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        const phoneField = isPhoneField(field);

        const inputType =
          field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : field.type === "email"
                ? "email"
                : phoneField
                  ? "tel"
                  : "text";

        return (
          <div key={field.key}>
            <label htmlFor={field.key} className="block text-sm font-medium text-fg">
              {field.label}
              {field.required ? "" : " (opcional)"}
            </label>
            <input
              id={field.key}
              name={field.key}
              type={inputType}
              required={field.required}
              inputMode={phoneField ? "tel" : undefined}
              placeholder={phoneField ? PHONE_PLACEHOLDER : undefined}
              pattern={phoneField ? PHONE_INPUT_PATTERN : undefined}
              title={phoneField ? PHONE_HINT : undefined}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-500"
            />
            {phoneField ? <p className="mt-1 text-xs text-fg-muted">{PHONE_HINT}</p> : null}
          </div>
        );
      })}

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}
