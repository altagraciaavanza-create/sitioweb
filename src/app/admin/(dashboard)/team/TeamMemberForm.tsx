"use client";

import { useActionState, useEffect, useRef } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import type { TeamFormState } from "./actions";

type Member = {
  id?: string;
  name: string;
  role?: string | null;
  activity?: string | null;
  photoUrl?: string | null;
  whatsappNumber?: string | null;
  whyParticipate?: string | null;
  order: number;
  published: boolean;
};

export function TeamMemberForm({
  action,
  member,
  onSuccess,
}: {
  action: (state: TeamFormState, formData: FormData) => Promise<TeamFormState>;
  member?: Member;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const { toast } = useToast();
  const notified = useRef<TeamFormState | null>(null);

  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;

    if (state.success) {
      toast({ variant: "success", title: member?.id ? "Integrante actualizado" : "Integrante creado" });
      onSuccess?.();
    } else if (state.error) {
      toast({ variant: "danger", title: "No se pudo guardar", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

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

      <AdminField
        label="WhatsApp (opcional)"
        htmlFor="whatsappNumber"
        hint="Con código de país, ej: 5493547000000. Se muestra como un botón para escribirle directo."
      >
        <AdminInput
          id="whatsappNumber"
          name="whatsappNumber"
          defaultValue={member?.whatsappNumber ?? ""}
        />
      </AdminField>

      <AdminField
        label="Foto (opcional)"
        htmlFor="photo"
        hint="Subí una imagen, o pegá una URL abajo si ya tenés una alojada en otro lado. Si subís un archivo, tiene prioridad sobre la URL."
      >
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          className="block w-full text-sm text-fg-muted file:mr-3 file:rounded-md file:border-0 file:bg-bg-subtle file:px-3 file:py-2 file:text-sm file:font-medium file:text-fg hover:file:bg-border"
        />
        {member?.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photoUrl}
            alt=""
            className="mt-3 h-16 w-16 rounded-full object-cover"
          />
        ) : null}
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

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar"}
      </AdminButton>
    </form>
  );
}
