"use client";

import { useState } from "react";
import { AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Modal } from "@/components/ui/Modal";
import { ParticipationForm } from "./ParticipationForm";
import { createParticipationOption, updateParticipationOption, deleteParticipationOption } from "./actions";

type Option = {
  id: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
  formId: string | null;
};

type FormOption = { id: string; name: string };

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; option: Option };

export function ParticipationManager({ items, formOptions }: { items: Option[]; formOptions: FormOption[] }) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const formNameById = new Map(formOptions.map((f) => [f.id, f.name]));

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setModal({ mode: "create" })}>Nueva opción</AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmpty>Todavía no hay opciones cargadas.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((option) => (
            <AdminCard key={option.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {option.title}
                  {!option.published ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">
                      Oculta
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-fg-muted">{option.description}</p>
                <p className="mt-1 text-xs text-fg-muted">
                  {option.formId && formNameById.has(option.formId) ? (
                    <>
                      Abre el formulario: <strong>{formNameById.get(option.formId)}</strong>
                    </>
                  ) : (
                    "Sin formulario asignado (solo texto)"
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModal({ mode: "edit", option })}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Editar
                </button>
                <AdminDeleteButton
                  action={deleteParticipationOption.bind(null, option.id)}
                  confirmMessage={`¿Eliminar "${option.title}"?`}
                  successMessage="Opción eliminada."
                />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? `Editar: ${modal.option.title}` : "Nueva opción de participación"}
      >
        {modal.mode === "create" ? (
          <ParticipationForm
            action={createParticipationOption}
            formOptions={formOptions}
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : modal.mode === "edit" ? (
          <ParticipationForm
            action={updateParticipationOption.bind(null, modal.option.id)}
            option={modal.option}
            formOptions={formOptions}
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : null}
      </Modal>
    </div>
  );
}
