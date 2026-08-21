"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PublicDynamicForm } from "@/components/forms/PublicDynamicForm";
import type { FieldDef } from "@/db/fields";

/**
 * El bloque "Formulario" del constructor de páginas siempre se muestra
 * como un botón que abre el formulario en un modal, en vez de tenerlo
 * incrustado y siempre visible en la página.
 */
export function FormBlockModal({
  buttonLabel,
  modalTitle,
  modalDescription,
  formId,
  fields,
  successMessage,
}: {
  buttonLabel: string;
  modalTitle: string;
  modalDescription?: string | null;
  formId: string;
  fields: FieldDef[];
  successMessage: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={modalTitle}
        description={modalDescription ?? undefined}
      >
        <PublicDynamicForm
          formId={formId}
          fields={fields}
          successMessage={successMessage}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
