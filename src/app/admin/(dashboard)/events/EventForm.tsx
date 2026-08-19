"use client";

import { useActionState } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import type { EventFormState } from "./actions";

type Event = {
  id?: string;
  title: string;
  description?: string | null;
  startsAt: Date | string;
  location?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  published: boolean;
};

function toLocalDatetimeInput(date: Date | string) {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function EventForm({
  action,
  event,
}: {
  action: (state: EventFormState, formData: FormData) => Promise<EventFormState>;
  event?: Event;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <AdminField label="Título" htmlFor="title">
        <AdminInput id="title" name="title" required defaultValue={event?.title} />
      </AdminField>

      <AdminField label="Descripción breve" htmlFor="description">
        <AdminTextarea id="description" name="description" rows={3} defaultValue={event?.description ?? ""} />
      </AdminField>

      <AdminField label="Fecha y hora" htmlFor="startsAt">
        <AdminInput
          id="startsAt"
          name="startsAt"
          type="datetime-local"
          required
          defaultValue={event ? toLocalDatetimeInput(event.startsAt) : ""}
        />
      </AdminField>

      <AdminField label="Lugar" htmlFor="location">
        <AdminInput id="location" name="location" defaultValue={event?.location ?? ""} />
      </AdminField>

      <AdminField label="Texto del botón (opcional)" htmlFor="ctaLabel">
        <AdminInput id="ctaLabel" name="ctaLabel" defaultValue={event?.ctaLabel ?? ""} />
      </AdminField>

      <AdminField label="Link del botón (opcional)" htmlFor="ctaHref">
        <AdminInput id="ctaHref" name="ctaHref" defaultValue={event?.ctaHref ?? ""} />
      </AdminField>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={event?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="published" className="text-sm text-fg">
          Publicado
        </label>
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar"}
      </AdminButton>
    </form>
  );
}
