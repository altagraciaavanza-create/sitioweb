"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Modal } from "@/components/ui/Modal";
import { ContentTypeForm } from "./ContentTypeForm";
import { createContentType, updateContentType, deleteContentType } from "./actions";
import type { FieldDef } from "@/db/fields";

type ContentType = {
  id: string;
  name: string;
  namePlural: string;
  slug: string;
  description: string | null;
  fields: FieldDef[];
};

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; type: ContentType };

export function ContentTypesManager({ items }: { items: ContentType[] }) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setModal({ mode: "create" })}>Nuevo tipo</AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmpty>Todavía no creaste ningún tipo de contenido.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((type) => (
            <AdminCard key={type.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">{type.namePlural}</p>
                <p className="text-xs text-fg-muted">
                  {type.fields.length} campo(s)
                  {type.description ? ` · ${type.description}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/content-types/${type.id}/entries`} className="text-sm text-brand-600 hover:underline">
                  Entradas
                </Link>
                <button
                  type="button"
                  onClick={() => setModal({ mode: "edit", type })}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Editar tipo
                </button>
                <AdminDeleteButton
                  action={deleteContentType.bind(null, type.id)}
                  confirmMessage={`¿Eliminar "${type.namePlural}"? También se van a borrar todas sus entradas.`}
                  successMessage="Tipo de contenido eliminado."
                />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? `Editar tipo: ${modal.type.namePlural}` : "Nuevo tipo de contenido"}
        maxWidth="max-w-2xl"
      >
        {modal.mode === "create" ? (
          <ContentTypeForm action={createContentType} onSuccess={() => setModal({ mode: "closed" })} />
        ) : modal.mode === "edit" ? (
          <ContentTypeForm
            action={updateContentType.bind(null, modal.type.id)}
            contentType={modal.type}
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : null}
      </Modal>
    </div>
  );
}
