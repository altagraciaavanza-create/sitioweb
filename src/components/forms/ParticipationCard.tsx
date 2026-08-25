"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { PublicDynamicForm } from "./PublicDynamicForm";
import type { FieldDef } from "@/db/fields";

export function ParticipationCard({
  title,
  description,
  form,
}: {
  title: string;
  description: string;
  form?: {
    id: string;
    name: string;
    description?: string | null;
    fields: FieldDef[];
    successMessage: string;
  } | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {form ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-full w-full rounded-lg border border-border bg-fg/5 p-6 text-left shadow-sm transition-shadow duration-150 hover:bg-fg/8 hover:shadow-md"
        >
          <h2 className="text-base font-semibold text-fg">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>
          <span className="mt-3 inline-block text-sm font-medium text-brand-600">Abrir formulario →</span>
        </button>
      ) : (
        <Card className="h-full">
          <h2 className="text-base font-semibold text-fg">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>
        </Card>
      )}

      {form ? (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={form.name}
          description={form.description ?? undefined}
        >
          <PublicDynamicForm
            formId={form.id}
            fields={form.fields}
            successMessage={form.successMessage}
            onSuccess={() => setOpen(false)}
          />
        </Modal>
      ) : null}
    </>
  );
}
