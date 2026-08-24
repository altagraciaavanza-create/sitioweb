import { z } from "zod";

/**
 * Catálogo de bloques del page builder.
 *
 * Cada bloque tiene: un `type` (discriminante), un schema Zod que valida
 * y tipa su `content`, una etiqueta legible para el panel, y metadata para
 * el formulario de edición (ver src/components/admin/block-forms).
 *
 * Agregar un bloque nuevo implica: 1) sumarlo acá con su schema, 2) crear
 * el componente público en src/components/blocks/, 3) registrarlo en
 * src/components/blocks/registry.tsx, 4) crear su formulario de edición en
 * el panel.
 */

/**
 * Color opcional por campo de texto — lo que permite, desde el modo edición
 * en vivo (ver src/components/editing/), tocar el color de un texto puntual
 * sin afectar el resto del perfil de identidad visual. `undefined`/vacío =
 * usa el color por defecto del bloque (heredado del tema).
 */
const optionalHexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Tiene que ser un color hexadecimal, ej: #1F7A5C")
  .optional();

/**
 * Override de estilo "de contenedor" que se puede aplicar desde el modo
 * edición en vivo sobre una sección completa o una tarjeta puntual (ver
 * src/components/editing/ContainerStyleTrigger.tsx y ContainerStylePanel.tsx).
 * Todos los campos son opcionales: ausente = usa el valor por defecto que ya
 * trae el bloque/componente (heredado del tema o del tono de sección).
 */
export const containerStyleSchema = z.object({
  background: optionalHexColor,
  // Espaciado interno en px. En una sección se aplica solo arriba/abajo
  // (el ancho ya lo maneja el Container); en una tarjeta se aplica en las
  // cuatro direcciones.
  padding: z.number().min(0).max(200).optional(),
  // Solo tiene efecto visible en contenedores angostos (tarjetas) — una
  // sección de ancho completo no se ve distinta con bordes redondeados.
  radius: z.number().min(0).max(48).optional(),
  // Ancho máximo en px — solo tiene sentido en tarjetas (una sección ya es
  // de ancho completo por diseño). No es "tamaño libre" tipo canvas: el
  // sitio sigue en flujo normal, esto solo acota cuánto puede crecer.
  width: z.number().min(80).max(1200).optional(),
  // "Posición" en un sitio de flujo normal (no canvas) se traduce en
  // espaciado externo: empujar el contenedor más arriba/abajo respecto de
  // sus vecinos, sin romper el resto del layout.
  marginTop: z.number().min(-100).max(200).optional(),
  marginBottom: z.number().min(-100).max(200).optional(),
  // Mismo schema se reutiliza para el estilo de un TEXTO puntual (ver
  // TextStyleTrigger.tsx) — ahí solo importan fontSize + marginTop/Bottom
  // (el "tamaño" y la "posición" del texto), el resto queda sin usar.
  fontSize: z.number().min(10).max(200).optional(),
});
export type ContainerStyle = z.infer<typeof containerStyleSchema>;

export const heroBlockSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  primaryCta: z.object({ label: z.string(), href: z.string(), color: optionalHexColor }).optional(),
  secondaryCta: z.object({ label: z.string(), href: z.string(), color: optionalHexColor }).optional(),
  titleColor: optionalHexColor,
  descriptionColor: optionalHexColor,
  // Tamaño y posición del título en sí (no del contenedor de la sección,
  // que es `containerStyle` de más abajo) — ver TextStyleTrigger.tsx.
  titleStyle: containerStyleSchema.optional(),
  // Tamaño de fuente POR LÍNEA del título — ej. "Alta Gracia," en 64px y
  // "avancemos." en 96px. Se alinea por índice con las líneas de `title`
  // separadas por "\n" (ver LineBreakTrigger.tsx). Un valor `undefined` en
  // una posición = esa línea usa `titleStyle.fontSize` (o el tamaño
  // automático si tampoco hay override ahí).
  titleLineSizes: z.array(z.number().min(10).max(200).optional()).optional(),
  containerStyle: containerStyleSchema.optional(),
});

export const richTextBlockSchema = z.object({
  title: z.string().optional(),
  body: z.string().min(1, "El contenido es obligatorio"),
  align: z.enum(["left", "center"]).default("center"),
  // Fondo de la sección: "default" = fondo de página, "subtle" = un tono
  // más (ver Section.tsx). Antes esto no era configurable — el mockup de
  // la landing alterna secciones claras/oscuras entre bloques.
  tone: z.enum(["default", "subtle"]).default("default"),
  titleColor: optionalHexColor,
  bodyColor: optionalHexColor,
  containerStyle: containerStyleSchema.optional(),
});

export const principlesBlockSchema = z.object({
  title: z.string().default("Nuestras convicciones"),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        style: containerStyleSchema.optional(),
        iconColor: optionalHexColor,
      })
    )
    .min(1),
  containerStyle: containerStyleSchema.optional(),
});

export const topicGridBlockSchema = z.object({
  title: z.string().default("Agenda para Alta Gracia"),
  description: z.string().optional(),
  source: z.enum(["all_topics", "manual"]).default("all_topics"),
  containerStyle: containerStyleSchema.optional(),
});

export const articleGridBlockSchema = z.object({
  title: z.string().default("Estamos trabajando"),
  description: z.string().optional(),
  limit: z.number().int().min(1).max(12).default(3),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  containerStyle: containerStyleSchema.optional(),
});

export const ctaBlockSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  // "solid" = fondo naranja de marca lleno (el llamado a la acción
  // destacado del mockup); "plain" = fondo de página, solo el botón lleva
  // color. Antes solo existía el equivalente a "solid".
  style: z.enum(["solid", "plain"]).default("solid"),
  titleColor: optionalHexColor,
  descriptionColor: optionalHexColor,
  buttonColor: optionalHexColor,
  containerStyle: containerStyleSchema.optional(),
});

export const teamGridBlockSchema = z.object({
  title: z.string().default("Equipo"),
  description: z.string().optional(),
  containerStyle: containerStyleSchema.optional(),
});

/**
 * Grilla genérica de tarjetas chicas (título + texto), sin la numeración
 * de sección de "Convicciones" — para bloques institucionales tipo
 * "Por qué nacemos / Qué buscamos construir" (página Nosotros).
 */
export const infoCardsBlockSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        style: containerStyleSchema.optional(),
      })
    )
    .min(1),
  containerStyle: containerStyleSchema.optional(),
});

/**
 * Lista de afirmaciones/frases destacadas (borde de color a la izquierda,
 * sin tarjeta) — usado en la página Visión.
 */
export const affirmationsBlockSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        text: z.string().min(1),
        style: containerStyleSchema.optional(),
      })
    )
    .min(1),
  containerStyle: containerStyleSchema.optional(),
});

export const imageBlockSchema = z.object({
  imageUrl: z.string().min(1),
  alt: z.string().min(1, "El texto alternativo es obligatorio"),
  caption: z.string().optional(),
});

export const emptyStateBlockSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const contentListBlockSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  contentTypeId: z.string().min(1, "Elegí un tipo de contenido"),
});

export const formBlockSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  formId: z.string().min(1, "Elegí un formulario"),
});

export const blockRegistrySchema = {
  hero: { label: "Hero", schema: heroBlockSchema },
  rich_text: { label: "Bloque de texto", schema: richTextBlockSchema },
  principles: { label: "Grilla de convicciones", schema: principlesBlockSchema },
  topic_grid: { label: "Grilla de ejes temáticos", schema: topicGridBlockSchema },
  article_grid: { label: "Grilla de actualidad", schema: articleGridBlockSchema },
  cta: { label: "Llamado a la acción", schema: ctaBlockSchema },
  team_grid: { label: "Grilla de equipo", schema: teamGridBlockSchema },
  info_cards: { label: "Grilla de tarjetas", schema: infoCardsBlockSchema },
  affirmations: { label: "Lista de afirmaciones", schema: affirmationsBlockSchema },
  image: { label: "Imagen", schema: imageBlockSchema },
  empty_state: { label: "Estado vacío", schema: emptyStateBlockSchema },
  content_list: { label: "Lista de contenido", schema: contentListBlockSchema },
  form: { label: "Formulario", schema: formBlockSchema },
} as const;

export type BlockType = keyof typeof blockRegistrySchema;

export const blockTypes = Object.keys(blockRegistrySchema) as BlockType[];

export type BlockContent<T extends BlockType> = z.infer<
  (typeof blockRegistrySchema)[T]["schema"]
>;

/** Bloque tal como se guarda/lee de la base de datos, ya tipado. */
export type PageBlockData =
  | { id: string; type: "hero"; content: BlockContent<"hero"> }
  | { id: string; type: "rich_text"; content: BlockContent<"rich_text"> }
  | { id: string; type: "principles"; content: BlockContent<"principles"> }
  | { id: string; type: "topic_grid"; content: BlockContent<"topic_grid"> }
  | { id: string; type: "article_grid"; content: BlockContent<"article_grid"> }
  | { id: string; type: "cta"; content: BlockContent<"cta"> }
  | { id: string; type: "team_grid"; content: BlockContent<"team_grid"> }
  | { id: string; type: "info_cards"; content: BlockContent<"info_cards"> }
  | { id: string; type: "affirmations"; content: BlockContent<"affirmations"> }
  | { id: string; type: "image"; content: BlockContent<"image"> }
  | { id: string; type: "empty_state"; content: BlockContent<"empty_state"> }
  | { id: string; type: "content_list"; content: BlockContent<"content_list"> }
  | { id: string; type: "form"; content: BlockContent<"form"> };

export function validateBlockContent(type: BlockType, content: unknown) {
  return blockRegistrySchema[type].schema.parse(content);
}
