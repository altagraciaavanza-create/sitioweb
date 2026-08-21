"use server";

import { eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { forms, formSubmissions } from "@/db/schema";
import { validateEntryData, type FieldDef } from "@/db/fields";

export type PublicFormState = { error?: string; success?: boolean };

/**
 * Server action pública: recibe el envío de un formulario dinámico (creado
 * desde /admin/forms) y lo guarda en form_submissions.
 */
export async function submitPublicForm(
  formId: string,
  _prevState: PublicFormState,
  formData: FormData
): Promise<PublicFormState> {
  if (!isDbConfigured) {
    return { error: "El formulario no está disponible en este momento." };
  }

  const [formDef] = await db.select().from(forms).where(eq(forms.id, formId));
  if (!formDef) {
    return { error: "Formulario no encontrado." };
  }

  const { data, error } = validateEntryData(formDef.fields as FieldDef[], formData);
  if (error) return { error };

  await db.insert(formSubmissions).values({ formId, data });
  return { success: true };
}
