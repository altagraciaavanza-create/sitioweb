"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { posts, postCategoryEnum } from "@/db/schema";

const postSchema = z.object({
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9-]+$/, "Usá solo minúsculas, números y guiones"),
  title: z.string().min(1, "El título es obligatorio"),
  excerpt: z.string().min(1, "El resumen es obligatorio"),
  body: z.string().optional(),
  category: z.enum(postCategoryEnum.enumValues),
  coverImageUrl: z.string().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
});

export type PostFormState = { error?: string };

function requireDb() {
  if (!isDbConfigured) {
    throw new Error("La base de datos no está configurada todavía (falta DATABASE_URL).");
  }
}

function parseForm(formData: FormData) {
  return postSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body") || undefined,
    category: formData.get("category"),
    coverImageUrl: formData.get("coverImageUrl") || undefined,
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt") || undefined,
  });
}

export async function createPost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const { publishedAt, ...rest } = parsed.data;

  try {
    await db.insert(posts).values({
      ...rest,
      publishedAt: publishedAt ? new Date(publishedAt) : rest.status === "published" ? new Date() : null,
    });
  } catch {
    return { error: "Ya existe una publicación con ese slug." };
  }

  revalidatePath("/actualidad");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(
  id: string,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  try {
    requireDb();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };

  const { publishedAt, ...rest } = parsed.data;

  await db
    .update(posts)
    .set({
      ...rest,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id));

  revalidatePath("/actualidad");
  revalidatePath(`/actualidad/${parsed.data.slug}`);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  requireDb();
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/actualidad");
  revalidatePath("/admin/posts");
}
