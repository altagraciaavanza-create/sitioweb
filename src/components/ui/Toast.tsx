"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "info" | "warning" | "danger";

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastInput = {
  variant?: ToastVariant;
  title: string;
  description?: string;
  /** ms antes de auto-cerrarse. 0 = no se cierra solo. */
  duration?: number;
  actions?: ToastAction[];
};

type ToastItem = ToastInput & { id: string };

type ToastContextValue = {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<
  ToastVariant,
  { border: string; iconBg: string; iconColor: string; bar: string; badge: string }
> = {
  success: {
    border: "border-emerald-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    bar: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
  },
  info: {
    border: "border-sky-100",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    bar: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700",
  },
  warning: {
    border: "border-amber-100",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    bar: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
  },
  danger: {
    border: "border-red-100",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    bar: "bg-red-500",
    badge: "bg-red-50 text-red-700",
  },
};

function VariantIcon({ variant, className }: { variant: ToastVariant; className?: string }) {
  if (variant === "success") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
        <path
          fillRule="evenodd"
          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM10 8a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 8Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  if (variant === "danger") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.25v3.25H9a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-.25V9.75A.75.75 0 0 0 10.5 9H9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const variant = toast.variant ?? "info";
  const styles = VARIANT_STYLES[variant];
  const duration = toast.duration ?? 5000;
  const [leaving, setLeaving] = useState(false);
  const [entered, setEntered] = useState(false);

  const handleClose = useCallback(() => {
    setLeaving(true);
    window.setTimeout(onClose, 180);
  }, [onClose]);

  useEffect(() => {
    const enterId = window.setTimeout(() => setEntered(true), 10);
    let closeId: number | undefined;
    if (duration > 0) {
      closeId = window.setTimeout(handleClose, duration);
    }
    return () => {
      window.clearTimeout(enterId);
      if (closeId) window.clearTimeout(closeId);
    };
  }, [duration, handleClose]);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border bg-white shadow-lg transition-all duration-200",
        styles.border,
        entered && !leaving ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", styles.iconBg)}>
          <VariantIcon variant={variant} className={cn("h-4 w-4", styles.iconColor)} />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold text-fg">{toast.title}</p>
          {toast.description ? <p className="mt-0.5 text-sm text-fg-muted">{toast.description}</p> : null}
          {toast.actions && toast.actions.length > 0 ? (
            <div className="mt-2 flex items-center gap-4">
              {toast.actions.map((action, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    action.onClick();
                    handleClose();
                  }}
                  className="text-sm font-medium text-brand-600 hover:underline"
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar notificación"
          className="shrink-0 rounded-md p-1 text-fg-muted/70 hover:bg-bg-subtle hover:text-fg"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
      <div className={cn("h-1 w-full", styles.bar)} />
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  // El primer render del cliente (el que React usa para hidratar) tiene que
  // devolver lo mismo que el servidor. Como el portal solo puede existir en
  // el cliente, arrancamos en false y lo activamos recién después de montar.
  const [mounted, setMounted] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    idRef.current += 1;
    const id = `toast-${idRef.current}`;
    setToasts((prev) => [...prev, { ...input, id }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted
        ? createPortal(
            <div
              aria-live="polite"
              className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3"
            >
              {toasts.map((t) => (
                <ToastCard key={t.id} toast={t} onClose={() => dismiss(t.id)} />
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

/** Hook para disparar toasts desde cualquier client component. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>.");
  }
  return ctx;
}
