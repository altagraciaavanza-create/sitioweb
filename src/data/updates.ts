export type UpdateItem = {
  slug: string;
  title: string;
  date: string; // ISO date
  excerpt: string;
  category:
    | "reuniones"
    | "actividades"
    | "documentos"
    | "propuestas"
    | "comunicados"
    | "recorridas"
    | "posiciones_institucionales";
};

/**
 * Contenido de ejemplo — editable. No representa reuniones o actividades
 * reales hasta que sea reemplazado por contenido definitivo.
 */
export const latestUpdates: UpdateItem[] = [
  {
    slug: "segunda-reunion-alta-gracia-avanza",
    title: "Segunda reunión abierta de Alta Gracia Avanza",
    date: "2026-08-10",
    excerpt:
      "Vecinos y vecinas se reunieron para seguir construyendo la agenda de propuestas para la ciudad. (Contenido de ejemplo, editable.)",
    category: "reuniones",
  },
  {
    slug: "primer-encuentro-equipos-tematicos",
    title: "Primer encuentro de equipos temáticos",
    date: "2026-07-28",
    excerpt:
      "Se conformaron los primeros equipos de trabajo por área temática. (Contenido de ejemplo, editable.)",
    category: "actividades",
  },
  {
    slug: "recorrida-por-barrios",
    title: "Recorrida por barrios de Alta Gracia",
    date: "2026-07-15",
    excerpt:
      "Charlas con comerciantes y vecinos para relevar necesidades concretas. (Contenido de ejemplo, editable.)",
    category: "recorridas",
  },
];
