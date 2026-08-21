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

export const heroBlockSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  primaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
  secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
  titleColor: optionalHexColor,
  descriptionColor: optionalHexColor,
});

export const richTextBlockSchema = z.object({
  title: z.string().optional(),
  body: z.string().min(1, "El contenido es obligatorio"),
  align: z.enum(["left", "center"]).default("center"),
  titleColor: optionalHexColor,
  bodyColor: optionalHexColor,
});

export const principlesBlockSchema = z.object({
  title: z.string().default("Nuestras convicciones"),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      })
    )
    .min(1),
});

export const topicGridBlockSchema = z.object({
  title: z.string().default("Agenda para Alta Gracia"),
  description: z.string().optional(),
  source: z.enum(["all_topics", "manual"]).default("all_topics"),
});

export const articleGridBlockSchema = z.object({
  title: z.string().default("Estamos trabajando"),
  description: z.string().optional(),
  limit: z.number().int().min(1).max(12).default(3),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const ctaBlockSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  titleColor: optionalHexColor,
  descriptionColor: optionalHexColor,
});

export const teamGridBlockSchema = z.object({
  title: z.string().default("Equipo"),
  description: z.string().optional(),
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
  | { id: string; type: "image"; content: BlockContent<"image"> }
  | { id: string; type: "empty_state"; content: BlockContent<"empty_state"> }
  | { id: string; type: "content_list"; content: BlockContent<"content_list"> }
  | { id: string; type: "form"; content: BlockContent<"form"> };

export function validateBlockContent(type: BlockType, content: unknown) {
  return blockRegistrySchema[type].schema.parse(content);
}
