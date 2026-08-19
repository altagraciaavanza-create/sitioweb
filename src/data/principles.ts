export type Principle = {
  slug: string;
  title: string;
  description: string;
};

/** Convicciones centrales de Alta Gracia Avanza (sección Home). */
export const principles: Principle[] = [
  {
    slug: "libertad",
    title: "Libertad",
    description:
      "Creemos en una ciudad donde cada vecino pueda desarrollar su proyecto de vida sin trabas innecesarias.",
  },
  {
    slug: "transparencia",
    title: "Transparencia",
    description:
      "La gestión pública debe poder explicarse y verificarse. La transparencia es una práctica, no una promesa.",
  },
  {
    slug: "desarrollo",
    title: "Desarrollo",
    description:
      "Impulsar las condiciones para que Alta Gracia crezca: más oportunidades para emprender, producir y trabajar.",
  },
  {
    slug: "instituciones",
    title: "Instituciones",
    description:
      "Instituciones sólidas y previsibles como base de una ciudad que funciona para todos.",
  },
  {
    slug: "participacion",
    title: "Participación",
    description:
      "No hace falta ser político para participar en política. Cada idea vecinal suma.",
  },
];
