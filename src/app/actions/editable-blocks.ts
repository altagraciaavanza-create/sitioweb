"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { pageBlocks, topics } from "@/db/schema";
import { validateBlockContent, type BlockType } from "@/db/blocks";
import { getSession } from "@/lib/auth";

export type UpdateBlockFieldState = { error?: string; success?: boolean };

/**
 * Guarda un cambio hecho desde el modo edición en vivo del sitio público
 * (ver src/components/editing/EditableText.tsx): mergea `patch` sobre el
 * `content` JSON existente del bloque y lo vuelve a validar contra su
 * schema (src/db/blocks.ts) antes de guardarlo, para no poder persistir
 * nunca un valor inválido aunque el pedido venga manipulado a mano.
 *
 * Requiere sesión de admin — se vuelve a chequear acá server-side, nunca
 * confiar en que el botón de "modo edición" esté oculto en el cliente.
 */
export async function updateBlockField(
  blockId: string,
  patch: Record<string, unknown>
): Promise<UpdateBlockFieldState> {
  const session = await getSession();
  if (!session) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión en /admin." };
  }

  if (!isDbConfigured) {
    return { error: "La base de datos no está configurada todavía (falta DATABASE_URL)." };
  }

  const [row] = await db.select().from(pageBlocks).where(eq(pageBlocks.id, blockId));
  if (!row) {
    return { error: "Ese bloque ya no existe. Recargá la página." };
  }

  const merged = { ...(row.content as Record<string, unknown>), ...patch };

  let validated: unknown;
  try {
    validated = validateBlockContent(row.type as BlockType, merged);
  } catch {
    return { error: "El valor no es válido para este campo." };
  }

  await db
    .update(pageBlocks)
    .set({ content: validated as object, updatedAt: new Date() })
    .where(eq(pageBlocks.id, blockId));

  // El modo edición se usa sobre cualquier página pública ya migrada al page
  // builder, así que revalidamos todo el árbol público en vez de una sola
  // ruta puntual.
  revalidatePath("/", "layout");

  return { success: true };
}

export type ReorderState = { error?: string; success?: boolean };

/**
 * Reordena las secciones (bloques) de una página desde el modo edición en
 * vivo (arrastrar y soltar directamente sobre el sitio público, ver
 * src/components/editing/SortableBlockList.tsx). Mismo chequeo de sesión
 * que updateBlockField — nunca confiar en que el modo edición esté oculto
 * en el cliente.
 */
export async function reorderPageBlocksPublic(
  pageId: string,
  orderedIds: string[]
): Promise<ReorderState> {
  const session = await getSession();
  if (!session) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión en /admin." };
  }
  if (!isDbConfigured) {
    return { error: "La base de datos no está configurada todavía (falta DATABASE_URL)." };
  }

  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(pageBlocks)
        .set({ order: index })
        .where(eq(pageBlocks.id, id))
    )
  );

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Reordena los ejes temáticos (topics) desde la grilla de "Ideas"/Agenda
 * en modo edición en vivo. Los topics no viven en el `content` JSON de un
 * bloque — son su propia tabla, con su propia columna `order` — por eso
 * necesitan esta acción separada en vez de updateBlockField.
 */
export async function reorderTopicsPublic(orderedIds: string[]): Promise<ReorderState> {
  const session = await getSession();
  if (!session) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión en /admin." };
  }
  if (!isDbConfigured) {
    return { error: "La base de datos no está configurada todavía (falta DATABASE_URL)." };
  }

  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(topics).set({ order: index }).where(eq(topics.id, id))
    )
  );

  revalidatePath("/", "layout");
  return { success: true };
}
