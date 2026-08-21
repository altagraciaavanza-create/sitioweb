"use client";

import { useState } from "react";
import { AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Modal } from "@/components/ui/Modal";
import { EntryForm } from "../../EntryForm";
import { createEntry, updateEntry, deleteEntry } from "../../actions";
import type { FieldDef } from "@/db/fields";

type Entry = {
  id: string;
  data: Record<string, unknown>;
  order: number;
  published: boolean;
};

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; entry: Entry };

export function EntriesManager({
  contentTypeId,
  entries,
  fields,
  namePlural,
}: {
  contentTypeId: string;
  entries: Entry[];
  fields: FieldDef[];
  namePlural: string;
}) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const titleField = fields[0];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setModal({ mode: "create" })}>Nueva entrada</AdminButton>
      </div>

      {entries.length === 0 ? (
        <AdminEmpty>Todavía no hay entradas de {namePlural.toLowerCase()}.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const title = titleField ? String(entry.data[titleField.key] ?? "(sin título)") : entry.id;
            return (
              <AdminCard key={entry.id} className="flex items-center justify-between">
                <p className="text-sm font-semibold text-fg">
                  {title}
                  {!entry.published ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">Oculta</span>
                  ) : null}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModal({ mode: "edit", entry })}
                    className="text-sm text-brand-600 hover:underline"
                  >
                    Editar
                  </button>
                  <AdminDeleteButton
                    action={deleteEntry.bind(null, contentTypeId, entry.id)}
                    confirmMessage={`¿Eliminar "${title}"?`}
                    successMessage="Entrada eliminada."
                  />
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? "Editar entrada" : "Nueva entrada"}
        maxWidth="max-w-xl"
      >
        {modal.mode === "create" ? (
          <EntryForm
            action={createEntry.bind(null, contentTypeId)}
            fields={fields}
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : modal.mode === "edit" ? (
          <EntryForm
            action={updateEntry.bind(null, contentTypeId, modal.entry.id)}
            fields={fields}
            data={modal.entry.data}
            order={modal.entry.order}
            published={modal.entry.published}
            isEdit
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : null}
      </Modal>
    </div>
  );
}
