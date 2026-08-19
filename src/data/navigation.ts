export type NavItem = {
  label: string;
  href: string;
};

/** Navegación principal (header, desktop y mobile). */
export const mainNav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Ideas", href: "/ideas" },
  { label: "Participá", href: "/participa" },
  { label: "Actualidad", href: "/actualidad" },
];

/** CTA destacado en el header. */
export const headerCta: NavItem = { label: "Sumate", href: "/participa" };

/** Navegación secundaria / footer. */
export const footerNav: NavItem[] = [
  { label: "Agenda", href: "/agenda" },
  { label: "Equipo", href: "/equipo" },
  { label: "Transparencia", href: "/transparencia" },
  { label: "Contacto", href: "/contacto" },
  { label: "Documentos", href: "/transparencia" },
];
