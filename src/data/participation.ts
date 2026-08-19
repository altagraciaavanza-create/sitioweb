export type ParticipationOption = {
  slug: string;
  title: string;
  description: string;
};

/** Opciones de participación mostradas en /participa. */
export const participationOptions: ParticipationOption[] = [
  {
    slug: "conocer",
    title: "Quiero conocer el espacio",
    description: "Recibí información sobre quiénes somos y qué proponemos.",
  },
  {
    slug: "reunion",
    title: "Quiero asistir a una reunión",
    description: "Sumate a nuestros próximos encuentros abiertos.",
  },
  {
    slug: "idea",
    title: "Quiero aportar una idea",
    description: "Contanos un problema o una propuesta para tu barrio.",
  },
  {
    slug: "colaborar",
    title: "Quiero colaborar",
    description: "Sumá tu tiempo o tus capacidades al espacio.",
  },
  {
    slug: "equipo-tematico",
    title: "Quiero participar de un equipo temático",
    description: "Sumate a un equipo de trabajo por área.",
  },
  {
    slug: "fiscalizar",
    title: "Quiero fiscalizar",
    description: "Formá parte del cuerpo de fiscales de Alta Gracia Avanza.",
  },
  {
    slug: "afiliarme",
    title: "Quiero afiliarme",
    description: "Formalizá tu participación en el espacio.",
  },
];
