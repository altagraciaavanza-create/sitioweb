"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { teamMembers } from "@/db/schema";

const teamMemberSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  role: z.string().optional(),
  activity: z.string().optional(),
  photoUrl: z.string().optional(),
  whyParticipate: z.string().optional(),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(true),
});

export type TeamFormState = { error?: string };

function requireDb() {
  if (!isDbConfigured) {
    throw new Error(
      "La base de datos no está configurada todavía (falta DATABASE_URL)."
    );
  }
}

function parseForm(formData: FormData) {
  return teamMemberSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role") || undefined,
    activity: formData.get("activity") || undefined,
    photoUrl: formData.get("photoUrl") || undefined,
    whyParticipate: formData.get("whyParticipate") || undefined,
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });
}

export async function createTeamMember(
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await db.insert(teamMembers).values(parsed.data);
  revalidatePath("/equipo");
  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function updateTeamMember(
  id: string,
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  await db.update(teamMembers).set(parsed.data).where(eq(teamMembers.id, id));
  revalidatePath("/equipo");
  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  requireDb();
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidatePath("/equipo");
  revalidatePath("/admin/team");
}
