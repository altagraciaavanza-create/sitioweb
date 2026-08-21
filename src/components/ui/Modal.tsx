"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Modal genérico y reutilizable. Se usa tanto en el sitio público (para que
 * los formularios se abran en modal en vez de navegar a otra página) como
 * en el panel /admin (para crear/editar sin salir de la lista).
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  // El primer render del cliente (el que React usa para hidratar) tiene que
  // devolver lo mismo que el servidor. Como el portal solo puede existir en
  // el cliente, arrancamos en false y lo activamos recién después de montar.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-10 sm:items-center sm:pt-4">
      <div className="fixed inset-0 bg-fg/40 backdrop-blur-[1px]" onClick={onClose} aria-hidden />

      {/*
        El modal es su propia columna flex con altura máxima (no la altura
        del contenido): el header queda fijo arriba y solo el cuerpo hace
        scroll interno. Antes dependía de que la página entera scrolleara
        detrás del overlay, lo que en perfiles largos (como el de Identidad
        visual, con muchos controles) dejaba contenido cortado e imposible
        de alcanzar.
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative flex max-h-[85vh] w-full flex-col rounded-lg bg-white shadow-lg animate-in",
          maxWidth
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 rounded-md p-1 text-fg-muted hover:bg-bg-subtle hover:text-fg"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden>
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        {title || description ? (
          <div className="shrink-0 border-b border-border p-6 pb-4">
            {title ? <h2 className="pr-8 text-lg font-bold text-fg">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-fg-muted">{description}</p> : null}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
