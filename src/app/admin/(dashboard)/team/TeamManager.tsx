"use client";

import { useState } from "react";
import { AdminButton, AdminEmpty, AdminCard } from "@/components/admin/admin-ui";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Modal } from "@/components/ui/Modal";
import { TeamMemberForm } from "./TeamMemberForm";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "./actions";

type Member = {
  id: string;
  name: string;
  role: string | null;
  activity: string | null;
  photoUrl: string | null;
  whatsappNumber: string | null;
  whyParticipate: string | null;
  order: number;
  published: boolean;
};

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; member: Member };

export function TeamManager({ items }: { items: Member[] }) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setModal({ mode: "create" })}>Nuevo integrante</AdminButton>
      </div>

      {items.length === 0 ? (
        <AdminEmpty>Todavía no hay integrantes cargados.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((member) => (
            <AdminCard key={member.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">
                  {member.name}
                  {!member.published ? (
                    <span className="ml-2 rounded-full bg-bg-subtle px-2 py-0.5 text-xs text-fg-muted">
                      Borrador
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-fg-muted">{member.activity}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModal({ mode: "edit", member })}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Editar
                </button>
                <AdminDeleteButton
                  action={deleteTeamMember.bind(null, member.id)}
                  confirmMessage={`¿Eliminar a "${member.name}"?`}
                  successMessage="Integrante eliminado."
                />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? `Editar: ${modal.member.name}` : "Nuevo integrante"}
      >
        {modal.mode === "create" ? (
          <TeamMemberForm action={createTeamMember} onSuccess={() => setModal({ mode: "closed" })} />
        ) : modal.mode === "edit" ? (
          <TeamMemberForm
            action={updateTeamMember.bind(null, modal.member.id)}
            member={modal.member}
            onSuccess={() => setModal({ mode: "closed" })}
          />
        ) : null}
      </Modal>
    </div>
  );
}
