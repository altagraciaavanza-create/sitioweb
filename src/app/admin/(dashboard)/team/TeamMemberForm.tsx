"use client";

import { useActionState } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import type { TeamFormState } from "./actions";

type Member = {
  id?: string;
  name: string;
  role?: string | null;
  activity?: string | null;
  photoUrl?: string | null;
  whyParticipate?: string | null;
  order: number;
  published: boolean;
};

export function TeamMemberForm({
  action,
  member,
}: {
  action: (state: TeamFormState, formData: FormData) => Promise<TeamFormState>;
  member?: Member;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <AdminField label="Nombre" htmlFor="name">
        <AdminInput id="name" name="name" required defaultValue={member?.name} />
      </AdminField>

      <AdminField label="Rol en el espacio (opcional)" htmlFor="role">
        <AdminInput id="role" name="role" defaultValue={member?.role ?? ""} />
      </AdminField>

      <AdminField label="Actividad / profesión (opcional)" htmlFor="activity">
        <AdminInput id="activity" name="activity" defaultValue={member?.activity ?? ""} />
      </AdminField>

      <AdminField label="URL de foto (opcional)" htmlFor="photoUrl">
        <AdminInput id="photoUrl" name="photoUrl" defaultValue={member?.photoUrl ?? ""} />
      </AdminField>

      <AdminField label="¿Por qué decidí participar? (opcional)" htmlFor="whyParticipate">
        <AdminTextarea
          id="whyParticipate"
          name="whyParticipate"
          rows={3}
          defaultValue={member?.whyParticipate ?? ""}
        />
      </AdminField>

      <AdminField label="Orden" htmlFor="order" hint="Menor número aparece primero.">
        <AdminInput id="order" name="order" type="number" defaultValue={member?.order ?? 0} />
      </AdminField>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={member?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="published" className="text-sm text-fg">
          Publicado (visible en el sitio)
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
