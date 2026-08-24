/**
 * Configuración institucional central de Alta Gracia Avanza.
 *
 * Todos los datos institucionales (nombre, contacto, redes sociales, etc.)
 * deben vivir acá. Nunca hardcodear estos valores dentro de componentes.
 */

export const siteConfig = {
  name: "Alta Gracia Avanza",
  shortName: "Alta Gracia Avanza",
  tagline: "Alta Gracia puede avanzar.",
  description:
    "Alta Gracia Avanza es un espacio político local que promueve una ciudad más libre, transparente, moderna y con oportunidades, construida con la participación de sus vecinos.",
  url: "https://www.altagraciaavanza.org",
  locale: "es_AR",

  contact: {
    email: "contacto@altagraciaavanza.ar", // TODO: confirmar email institucional
    whatsapp: {
      // TODO: confirmar número de WhatsApp institucional
      phoneNumber: "5493547000000",
      displayNumber: "+54 9 3547 000-000",
      defaultMessage: "Hola, quiero conocer más sobre Alta Gracia Avanza.",
    },
    address: undefined as string | undefined, // Completar si corresponde
  },

  social: {
    instagram: "https://instagram.com/altagraciaavanza", // TODO: confirmar
    facebook: "https://facebook.com/altagraciaavanza", // TODO: confirmar
    twitter: undefined as string | undefined,
    tiktok: undefined as string | undefined,
    youtube: undefined as string | undefined,
  },

  defaultMetadata: {
    title: "Alta Gracia Avanza",
    titleTemplate: "%s · Alta Gracia Avanza",
    description:
      "Plataforma cívica de Alta Gracia Avanza: ideas, propuestas, actividades y participación ciudadana para Alta Gracia.",
    ogImage: "/og/default.png", // TODO: generar imagen social definitiva
  },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Helper para construir el link de WhatsApp con mensaje predefinido.
 *
 * `phoneNumber` y `message` son opcionales para no romper usos existentes,
 * pero siempre que haya un valor cargado en /admin/settings hay que
 * pasarlo explícitamente: si no, este helper cae en el número estático de
 * siteConfig y los cambios hechos en el panel no se reflejan en el sitio.
 */
export function getWhatsappLink(message?: string, phoneNumber?: string) {
  const text = encodeURIComponent(
    message ?? siteConfig.contact.whatsapp.defaultMessage
  );
  const phone = phoneNumber ?? siteConfig.contact.whatsapp.phoneNumber;
  return `https://wa.me/${phone}?text=${text}`;
}

/** Formatea un número de WhatsApp en formato E.164 (549...) para mostrarlo legible. */
export function formatWhatsappDisplay(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");
  // Formato esperado: 54 9 <área> <número>, ej: 5493547000000
  const match = digits.match(/^54(9)?(\d{2,4})(\d+)$/);
  if (!match) return `+${digits}`;
  const [, nine, area, rest] = match;
  return `+54 ${nine ?? ""}${nine ? " " : ""}${area} ${rest}`.replace(/\s+/g, " ").trim();
}
