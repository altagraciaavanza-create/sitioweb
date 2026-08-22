import type { BlockType } from "./blocks";

/** Contenido inicial al agregar un bloque nuevo desde el panel. */
export const blockDefaults: Record<BlockType, Record<string, unknown>> = {
  hero: {
    title: "Título del hero",
    description: "",
  },
  rich_text: {
    title: "",
    body: "Escribí el contenido acá.",
    align: "center",
  },
  principles: {
    title: "Nuestras convicciones",
    items: [{ title: "Ejemplo", description: "Descripción del ítem." }],
  },
  topic_grid: {
    title: "Agenda para Alta Gracia",
    description: "",
    source: "all_topics",
  },
  article_grid: {
    title: "Estamos trabajando",
    description: "",
    limit: 3,
  },
  cta: {
    title: "Título del llamado a la acción",
    description: "",
    ctaLabel: "Quiero participar",
    ctaHref: "/participa",
  },
  team_grid: {
    title: "Equipo",
    description: "",
  },
  info_cards: {
    title: "",
    items: [{ title: "Ejemplo", description: "Descripción del ítem." }],
  },
  affirmations: {
    title: "",
    items: [{ text: "Una afirmación destacada." }],
  },
  image: {
    imageUrl: "",
    alt: "",
  },
  empty_state: {
    title: "Próximamente",
    description: "",
  },
  content_list: {
    title: "",
    description: "",
    contentTypeId: "",
  },
  form: {
    title: "",
    description: "",
    formId: "",
  },
};
