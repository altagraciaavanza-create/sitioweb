"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Modal } from "@/components/ui/Modal";
import { FormDefForm } from "./FormDefForm";
import { createForm, updateForm, deleteForm } from "./actions";
import type { FieldDef } from "@/db/fields";

type FormDef = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  successMessage: string;
  fields: FieldDef[];
  unreadCount?: number;
};

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; formDef: FormDef };

export function FormsManager({ items }: { items: FormDef[] }) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setModal({ mode: "create" })}>Nuevo formulario</AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmpty>Todavía no creaste ningún formulario.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((form) => (
            <AdminCard key={form.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">{form.name}</p>
                <p className="text-xs text-fg-muted">{form.fields.length} campo(s)</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/forms/${form.id}/submissions`}
                  className="relative inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline"
                >
                  Respuestas
                  {form.unreadCount ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white">
                      {form.unreadCount > 99 ? "99+" : form.unreadCount}
                    </span>
                  ) : null}
                </Link>
                <button
                  type="button"
                  onClick={() => setModal({ mode: "edit", formDef: form })}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Editar
                </button>
                <AdminDeleteButton
                  action={deleteForm.bind(null, form.id)}
                  confirmMessage={`¿Eliminar "${form.name}"? También se van a borrar sus respuestas recibidas.`}
                  successMessage="Formulario eliminado."
                />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? `Editar formulario: ${modal.formDef.name}` : "Nuevo formulario"}
      >
        {modal.mode === "create" ? (
          <FormDefForm action={createForm} onSuccess={() => setModal({ mode: "closed" })} />
        ) : modal.mode === "edit" ? (
          <FormDefForm
            action={updateForm.bind(null, modal.formDef.id)}
            formDef={modal.formDef}
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : null}
      </Modal>
    </div>
  );
}
