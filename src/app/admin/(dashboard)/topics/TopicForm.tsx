"use client";

import { useActionState, useEffect, useRef } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import type { TopicFormState } from "./actions";

type Topic = {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  problem?: string | null;
  diagnosis?: string | null;
  proposal?: string | null;
  expectedImpact?: string | null;
  order: number;
  published: boolean;
};

export function TopicForm({
  action,
  topic,
  onSuccess,
}: {
  action: (state: TopicFormState, formData: FormData) => Promise<TopicFormState>;
  topic?: Topic;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const { toast } = useToast();
  const notified = useRef<TopicFormState | null>(null);

  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;

    if (state.success) {
      toast({ variant: "success", title: topic?.id ? "Eje actualizado" : "Eje creado" });
      onSuccess?.();
    } else if (state.error) {
      toast({ variant: "danger", title: "No se pudo guardar", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <AdminField label="Slug" htmlFor="slug" hint="Se usa en la URL: /ideas/tu-slug">
        <AdminInput id="slug" name="slug" required defaultValue={topic?.slug} />
      </AdminField>

      <AdminField label="Título" htmlFor="title">
        <AdminInput id="title" name="title" required defaultValue={topic?.title} />
      </AdminField>

      <AdminField label="Resumen" htmlFor="summary">
        <AdminTextarea id="summary" name="summary" rows={2} required defaultValue={topic?.summary} />
      </AdminField>

      <AdminField label="Problema" htmlFor="problem">
        <AdminTextarea id="problem" name="problem" rows={3} defaultValue={topic?.problem ?? ""} />
      </AdminField>

      <AdminField label="Diagnóstico" htmlFor="diagnosis">
        <AdminTextarea id="diagnosis" name="diagnosis" rows={3} defaultValue={topic?.diagnosis ?? ""} />
      </AdminField>

      <AdminField label="Propuesta" htmlFor="proposal">
        <AdminTextarea id="proposal" name="proposal" rows={3} defaultValue={topic?.proposal ?? ""} />
      </AdminField>

      <AdminField label="Impacto esperado" htmlFor="expectedImpact">
        <AdminTextarea
          id="expectedImpact"
          name="expectedImpact"
          rows={3}
          defaultValue={topic?.expectedImpact ?? ""}
        />
      </AdminField>

      <AdminField label="Orden" htmlFor="order">
        <AdminInput id="order" name="order" type="number" defaultValue={topic?.order ?? 0} />
      </AdminField>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={topic?.published ?? true}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="published" className="text-sm text-fg">
          Publicado
        </label>
      </div>

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar"}
      </AdminButton>
    </form>
  );
}
