export type Topic = {
  slug: string;
  title: string;
  summary: string;
  problem?: string | null;
  diagnosis?: string | null;
  proposal?: string | null;
  expectedImpact?: string | null;
};

/** Ejes temáticos de la agenda de Alta Gracia Avanza. */
export const topics: Topic[] = [
  {
    slug: "desarrollo-economico",
    title: "Desarrollo económico",
    summary:
      "Más oportunidades para emprender, producir y generar trabajo en Alta Gracia.",
  },
  {
    slug: "estado-eficiente",
    title: "Estado eficiente",
    summary:
      "Una Municipalidad que resuelva problemas en lugar de agregar trámites.",
  },
  {
    slug: "ciudad",
    title: "Ciudad",
    summary:
      "Infraestructura, movilidad y espacios públicos pensados para el vecino.",
  },
  {
    slug: "instituciones",
    title: "Instituciones",
    summary: "Instituciones locales sólidas, previsibles y transparentes.",
  },
  {
    slug: "ambiente",
    title: "Ambiente",
    summary: "Cuidado del entorno natural y patrimonio ambiental de la ciudad.",
  },
  {
    slug: "cultura-educacion",
    title: "Cultura y educación",
    summary: "Más oportunidades culturales y educativas para todas las edades.",
  },
  {
    slug: "seguridad-convivencia",
    title: "Seguridad y convivencia",
    summary: "Una ciudad donde se pueda circular y convivir con tranquilidad.",
  },
];
