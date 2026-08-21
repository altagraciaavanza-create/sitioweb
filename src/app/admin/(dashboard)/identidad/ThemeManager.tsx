"use client";

import { useState, useTransition } from "react";
import { AdminButton, AdminCard, AdminEmpty } from "@/components/admin/admin-ui";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { ThemeForm } from "./ThemeForm";
import { applyTheme, deleteTheme } from "./actions";
import type { ThemeColors, ThemeFontFamily, ThemeDesign } from "@/db/theme";

type ThemeDef = {
  id: string;
  name: string;
  colors: ThemeColors;
  fontFamily: ThemeFontFamily;
} & ThemeDesign;

type ModalState = { mode: "closed" } | { mode: "create" } | { mode: "edit"; theme: ThemeDef };

function ThemeSwatch({ colors }: { colors: ThemeColors }) {
  const swatchKeys: (keyof ThemeColors)[] = ["bg", "bgSubtle", "brand500", "brand700", "accent500"];
  return (
    <div className="flex h-8 overflow-hidden rounded-md border border-border">
      {swatchKeys.map((key) => (
        <div key={key} className="flex-1" style={{ background: colors[key] }} />
      ))}
    </div>
  );
}

function ApplyButton({ id, active }: { id: string | null; active: boolean }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  if (active) {
    return (
      <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
        Aplicado
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await applyTheme(id);
          toast({
            variant: "success",
            title: id ? "Perfil aplicado al sitio" : "Volviste al diseño original",
          });
        })
      }
      className="text-sm font-medium text-brand-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Aplicando..." : "Aplicar"}
    </button>
  );
}

export function ThemeManager({
  items,
  activeThemeId,
}: {
  items: ThemeDef[];
  activeThemeId: string | null;
}) {
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AdminButton onClick={() => setModal({ mode: "create" })}>Nuevo perfil</AdminButton>
      </div>

      <AdminCard className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-fg">Diseño original</p>
          <p className="text-xs text-fg-muted">El look de siempre del sitio, sin ningún perfil aplicado.</p>
        </div>
        <ApplyButton id={null} active={activeThemeId === null} />
      </AdminCard>

      {items.length === 0 ? (
        <AdminEmpty>Todavía no creaste ningún perfil de identidad visual.</AdminEmpty>
      ) : (
        <div className="space-y-3">
          {items.map((theme) => (
            <AdminCard key={theme.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-fg">{theme.name}</p>
                  <div className="mt-2 max-w-xs">
                    <ThemeSwatch colors={theme.colors} />
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-3">
                  <ApplyButton id={theme.id} active={activeThemeId === theme.id} />
                  <button
                    type="button"
                    onClick={() => setModal({ mode: "edit", theme })}
                    className="text-sm text-brand-600 hover:underline"
                  >
                    Editar
                  </button>
                  <AdminDeleteButton
                    action={deleteTheme.bind(null, theme.id)}
                    confirmMessage={`¿Eliminar el perfil "${theme.name}"?${
                      activeThemeId === theme.id ? " Está aplicado al sitio: volverá al diseño original." : ""
                    }`}
                    successMessage="Perfil eliminado."
                  />
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={modal.mode !== "closed"}
        onClose={() => setModal({ mode: "closed" })}
        title={modal.mode === "edit" ? `Editar perfil: ${modal.theme.name}` : "Nuevo perfil"}
        maxWidth="max-w-2xl"
      >
        {modal.mode === "create" ? (
          <ThemeForm onSuccess={() => setModal({ mode: "closed" })} />
        ) : modal.mode === "edit" ? (
          <ThemeForm theme={modal.theme} onSuccess={() => setModal({ mode: "closed" })} />
        ) : null}
      </Modal>
    </div>
  );
}
