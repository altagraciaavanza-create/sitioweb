"use client";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { deleteFormSubmission } from "../../actions";

export function SubmissionDeleteButton({ formId, submissionId }: { formId: string; submissionId: string }) {
  return (
    <AdminDeleteButton
      action={deleteFormSubmission.bind(null, formId, submissionId)}
      confirmMessage="¿Eliminar esta respuesta?"
      successMessage="Respuesta eliminada."
      className="text-xs text-red-600 hover:underline disabled:opacity-50"
    />
  );
}
