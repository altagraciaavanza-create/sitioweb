"use client";

import { useState } from "react";
import { AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { EventForm } from "./EventForm";
import { createEvent, updateEvent, deleteEvent } from "./actions";

type Event = {
  id: string;
  title: string;
  description: string | null;
  startsAt: Date | string;
  location: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  published: boolean;
};

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; event: Event };

export function EventsManager({ items }: { items: Event[] }) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setModal({ mode: "create" })}>Nuevo evento</AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmpty>Todavía no hay eventos cargados.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((event) => (
            <AdminCard key={event.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {event.title}
                  {!event.published ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">
                      Oculto
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-fg-muted">
                  {formatDate(new Date(event.startsAt).toISOString())}
                  {event.location ? ` · ${event.location}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModal({ mode: "edit", event })}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Editar
                </button>
                <AdminDeleteButton
                  action={deleteEvent.bind(null, event.id)}
                  confirmMessage={`¿Eliminar "${event.title}"?`}
                  successMessage="Evento eliminado."
                />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? `Editar: ${modal.event.title}` : "Nuevo evento"}
      >
        {modal.mode === "create" ? (
          <EventForm action={createEvent} onSuccess={() => setModal({ mode: "closed" })} />
        ) : modal.mode === "edit" ? (
          <EventForm
            action={updateEvent.bind(null, modal.event.id)}
            event={modal.event}
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : null}
      </Modal>
    </div>
  );
}
