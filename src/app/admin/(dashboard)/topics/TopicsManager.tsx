"use client";

import { useState } from "react";
import { AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Modal } from "@/components/ui/Modal";
import { TopicForm } from "./TopicForm";
import { createTopic, updateTopic, deleteTopic } from "./actions";

type Topic = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string | null;
  diagnosis: string | null;
  proposal: string | null;
  expectedImpact: string | null;
  order: number;
  published: boolean;
};

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; topic: Topic };

export function TopicsManager({ items }: { items: Topic[] }) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setModal({ mode: "create" })}>Nuevo eje</AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmpty>Todavía no hay ejes cargados.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((topic) => (
            <AdminCard key={topic.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {topic.title}
                  {!topic.published ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">
                      Borrador
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-fg-muted">/ideas/{topic.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModal({ mode: "edit", topic })}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Editar
                </button>
                <AdminDeleteButton
                  action={deleteTopic.bind(null, topic.id)}
                  confirmMessage={`¿Eliminar "${topic.title}"?`}
                  successMessage="Eje eliminado."
                />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? `Editar: ${modal.topic.title}` : "Nuevo eje temático"}
        maxWidth="max-w-2xl"
      >
        {modal.mode === "create" ? (
          <TopicForm action={createTopic} onSuccess={() => setModal({ mode: "closed" })} />
        ) : modal.mode === "edit" ? (
          <TopicForm
            action={updateTopic.bind(null, modal.topic.id)}
            topic={modal.topic}
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : null}
      </Modal>
    </div>
  );
}
