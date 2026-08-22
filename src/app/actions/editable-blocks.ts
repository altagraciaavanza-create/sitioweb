"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDbConfigured } from "@/db";
import { pageBlocks, topics, posts } from "@/db/schema";
import { validateBlockContent, containerStyleSchema, type BlockType, type ContainerStyle } from "@/db/blocks";
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

/**
 * Guarda el override de estilo de contenedor (fondo/espaciado) de una
 * sección — ver ContainerStyleTrigger.tsx. Es un caso particular de
 * `updateBlockField` (containerStyle es un campo más del `content` del
 * bloque), pero necesita ser una función propia: los bloques que usan el
 * engranaje de estilo son Server Components, y un Server Component no
 * puede pasarle a un Client Component una función armada al vuelo
 * (`(style) => updateBlockField(id, {...})`) — solo puede pasar una
 * referencia a una server action ya definida, con `.bind(null, blockId)`
 * para fijar el id de antemano.
 */
export async function updateBlockContainerStyle(
  blockId: string,
  style: ContainerStyle
): Promise<UpdateBlockFieldState> {
  return updateBlockField(blockId, { containerStyle: style });
}

/**
 * Guarda el color de UN elemento suelto dentro de un bloque (un botón, un
 * ícono) cuando ese color vive en un campo simple del `content` — ej.
 * `buttonColor` en el CTA. Igual que `updateBlockContainerStyle`, existe
 * como función propia (en vez de un closure armado al vuelo) para poder
 * pasarse con `.bind()` desde un Server Component a un Client Component
 * (ver ElementColorTrigger.tsx y el bug de "Event handlers cannot be
 * passed to Client Component props" documentado en el proyecto).
 */
export async function updateBlockColorField(
  blockId: string,
  field: string,
  color: string | undefined
): Promise<UpdateBlockFieldState> {
  return updateBlockField(blockId, { [field]: color });
}

/**
 * Igual que `updateBlockColorField`, pero para el color de un botón que
 * vive DENTRO de un objeto anidado del content (`primaryCta`/`secondaryCta`
 * del Hero) — hay que mandar el objeto completo, no solo el color.
 */
export async function updateHeroCtaColor(
  blockId: string,
  ctaKey: "primaryCta" | "secondaryCta",
  currentCta: { label: string; href: string; color?: string } | undefined,
  color: string | undefined
): Promise<UpdateBlockFieldState> {
  if (!currentCta) return { error: "No hay botón para editar." };
  return updateBlockField(blockId, { [ctaKey]: { ...currentCta, color } });
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

/**
 * Edita el título o el resumen de UN eje temático puntual desde el modo
 * edición en vivo (doble clic sobre la tarjeta, ver
 * SortableTopicGrid.tsx). Los topics viven en su propia tabla, no en el
 * `content` de un bloque, por eso no pasa por updateBlockField. Whitelist
 * de campos a propósito: nunca se acepta una columna arbitraria.
 */
export async function updateTopicField(
  topicId: string,
  patch: { title?: string; summary?: string }
): Promise<UpdateBlockFieldState> {
  const session = await getSession();
  if (!session) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión en /admin." };
  }
  if (!isDbConfigured) {
    return { error: "La base de datos no está configurada todavía (falta DATABASE_URL)." };
  }

  const safePatch: { title?: string; summary?: string } = {};
  if (typeof patch.title === "string" && patch.title.trim()) safePatch.title = patch.title.trim();
  if (typeof patch.summary === "string" && patch.summary.trim()) safePatch.summary = patch.summary.trim();
  if (Object.keys(safePatch).length === 0) {
    return { error: "El valor no puede quedar vacío." };
  }

  await db.update(topics).set(safePatch).where(eq(topics.id, topicId));
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Igual que `updateTopicField` pero para una novedad puntual de
 * Actualidad (tabla `posts`) — título o resumen.
 */
export async function updatePostField(
  postId: string,
  patch: { title?: string; excerpt?: string }
): Promise<UpdateBlockFieldState> {
  const session = await getSession();
  if (!session) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión en /admin." };
  }
  if (!isDbConfigured) {
    return { error: "La base de datos no está configurada todavía (falta DATABASE_URL)." };
  }

  const safePatch: { title?: string; excerpt?: string } = {};
  if (typeof patch.title === "string" && patch.title.trim()) safePatch.title = patch.title.trim();
  if (typeof patch.excerpt === "string" && patch.excerpt.trim()) safePatch.excerpt = patch.excerpt.trim();
  if (Object.keys(safePatch).length === 0) {
    return { error: "El valor no puede quedar vacío." };
  }

  await db.update(posts).set(safePatch).where(eq(posts.id, postId));
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Guarda el override de estilo de tarjeta (fondo/espaciado/bordes) de UN
 * eje temático puntual — ver ContainerStyleTrigger.tsx / TopicCard.tsx.
 * Se valida contra containerStyleSchema antes de guardar (nunca se acepta
 * un valor arbitrario) y se reemplaza entero, no se mergea: así "quitar"
 * un campo desde el panel (mandarlo `undefined`) también lo borra acá.
 */
export async function updateTopicStyle(
  topicId: string,
  style: ContainerStyle
): Promise<UpdateBlockFieldState> {
  const session = await getSession();
  if (!session) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión en /admin." };
  }
  if (!isDbConfigured) {
    return { error: "La base de datos no está configurada todavía (falta DATABASE_URL)." };
  }

  let validated: ContainerStyle;
  try {
    validated = containerStyleSchema.parse(style);
  } catch {
    return { error: "El valor no es válido." };
  }

  await db.update(topics).set({ styleOverrides: validated }).where(eq(topics.id, topicId));
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Igual que `updateTopicStyle` pero para una novedad puntual de Actualidad
 * (tabla `posts`).
 */
export async function updatePostStyle(
  postId: string,
  style: ContainerStyle
): Promise<UpdateBlockFieldState> {
  const session = await getSession();
  if (!session) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión en /admin." };
  }
  if (!isDbConfigured) {
    return { error: "La base de datos no está configurada todavía (falta DATABASE_URL)." };
  }

  let validated: ContainerStyle;
  try {
    validated = containerStyleSchema.parse(style);
  } catch {
    return { error: "El valor no es válido." };
  }

  await db.update(posts).set({ styleOverrides: validated }).where(eq(posts.id, postId));
  revalidatePath("/", "layout");
  return { success: true };
}
