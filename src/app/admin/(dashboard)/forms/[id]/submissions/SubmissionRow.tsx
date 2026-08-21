"use client";

import { useState, useTransition } from "react";
import { formatDate } from "@/lib/utils";
import { markSubmissionRead } from "../../actions";
import { SubmissionDeleteButton } from "./SubmissionDeleteButton";
import type { FieldDef } from "@/db/fields";

type Submission = {
  id: string;
  createdAt: string;
  readAt: string | null;
  data: Record<string, unknown>;
};

/**
 * Una fila de la "bandeja de entrada" de respuestas: arranca colapsada,
 * mostrando solo un resumen (primeros campos) y si está sin leer. Al
 * abrirla se ve el detalle completo y, si estaba sin leer, se marca como
 * leída automáticamente (como cualquier bandeja de entrada).
 */
export function SubmissionRow({
  submission,
  formId,
  fields,
}: {
  submission: Submission;
  formId: string;
  fields: FieldDef[];
}) {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(Boolean(submission.readAt));
  const [, startTransition] = useTransition();

  const summaryFields = fields.slice(0, 2);
  const summary = summaryFields
    .map((f) => String(submission.data[f.key] ?? "").trim())
    .filter(Boolean)
    .join(" · ");

  function handleToggle() {
    setOpen((prev) => !prev);
    if (!read) {
      setRead(true);
      startTransition(() => {
        markSubmissionRead(formId, submission.id);
      });
    }
  }

  return (
    <div
      className={`rounded-lg border px-4 py-3 transition-colors ${
        read ? "border-border bg-white" : "border-brand-300 bg-brand-50"
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-2">
          {read ? null : (
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-brand-600" aria-label="Sin leer" />
          )}
          <span className={`truncate text-sm ${read ? "font-medium text-fg" : "font-semibold text-fg"}`}>
            {summary || "Respuesta"}
          </span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <span className="text-xs text-fg-muted">{formatDate(submission.createdAt)}</span>
          <span className="text-fg-muted">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {open ? (
        <div className="mt-3 border-t border-border pt-3">
          <div className="flex justify-end">
            <SubmissionDeleteButton formId={formId} submissionId={submission.id} />
          </div>
          <dl className="mt-2 space-y-2">
            {fields.map((field) => (
              <div key={field.key}>
                <dt className="text-xs font-medium text-fg-muted">{field.label}</dt>
                <dd className="text-sm text-fg">{String(submission.data[field.key] ?? "—")}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}
