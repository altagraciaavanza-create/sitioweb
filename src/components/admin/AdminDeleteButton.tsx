"use client";

import { useTransition } from "react";
import { useToast } from "@/components/ui/Toast";

/**
 * Botón de eliminar reutilizable para el panel: pide confirmación, llama a
 * la Server Action directamente (sin <form>) y muestra un toast con el
 * resultado. La Server Action debe revalidar la ruta correspondiente para
 * que la lista se actualice sola.
 */
export function AdminDeleteButton({
  action,
  label = "Eliminar",
  confirmMessage = "¿Seguro que querés eliminar esto? Esta acción no se puede deshacer.",
  successMessage = "Eliminado correctamente.",
  className,
}: {
  action: () => Promise<void>;
  label?: string;
  confirmMessage?: string | null;
  successMessage?: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleClick() {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    startTransition(async () => {
      try {
        await action();
        toast({ variant: "success", title: successMessage });
      } catch (error) {
        toast({
          variant: "danger",
          title: "No se pudo eliminar",
          description: error instanceof Error ? error.message : undefined,
        });
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={className ?? "text-sm text-red-600 hover:underline disabled:opacity-50"}
    >
      {pending ? "Eliminando..." : label}
    </button>
  );
}
