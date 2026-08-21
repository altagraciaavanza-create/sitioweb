"use client";

import { useTransition } from "react";
import { useToast } from "@/components/ui/Toast";
import { markAllSubmissionsRead } from "../../actions";

export function MarkAllReadButton({ formId, disabled }: { formId: string; disabled?: boolean }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <button
      type="button"
      disabled={disabled || pending}
      onClick={() =>
        startTransition(async () => {
          await markAllSubmissionsRead(formId);
          toast({ variant: "success", title: "Marcadas como leídas" });
        })
      }
      className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg-muted hover:bg-bg-subtle disabled:opacity-50"
    >
      {pending ? "Marcando..." : "Marcar todas como leídas"}
    </button>
  );
}
