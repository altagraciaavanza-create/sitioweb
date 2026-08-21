"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { themeToCssVars, type ThemeColors, type ThemeFontFamily, type ThemeDesign } from "@/db/theme";
import { EditModeProvider } from "@/components/editing/EditModeContext";
import { EditModeToggle } from "@/components/editing/EditModeToggle";

/**
 * El panel /admin tiene su propio layout de pantalla completa (sidebar +
 * contenido) y no debe mostrar el header/footer del sitio público — no
 * tiene sentido navegar el menú público estando adentro del panel.
 *
 * Header y Footer se reciben ya renderizados (como Server Components) por
 * props en vez de importarlos acá: este componente es "use client" para
 * poder usar usePathname, y si los importara directamente arrastraría al
 * bundle del navegador su código de acceso a la base de datos.
 */
export function SiteChrome({
  header,
  footer,
  children,
  activeTheme,
  isAdminUser,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  /**
   * Perfil aplicado desde /admin/identidad, o null (diseño original). Se
   * aplica únicamente acá, en el contenedor del sitio público — el panel
   * /admin nunca lo recibe, así que su aspecto queda intacto pase lo que
   * pase con esto.
   */
  activeTheme: { colors: ThemeColors; fontFamily: ThemeFontFamily; design: ThemeDesign } | null;
  /**
   * Si hay una sesión de admin activa (calculado server-side en
   * RootLayout vía getSession()) — habilita el botón flotante de "modo
   * edición" sobre el sitio público. Un visitante normal nunca lo ve.
   */
  isAdminUser: boolean;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const themeStyle = activeTheme
    ? (themeToCssVars(activeTheme.colors, activeTheme.fontFamily, activeTheme.design) as CSSProperties)
    : undefined;

  return (
    // Este div (no un fragment) es necesario para que las variables de
    // color realmente "pinten": solo afectan a los elementos que están
    // DENTRO de este contenedor. Por eso repite acá bg-bg/text-fg (para
    // verse con los valores ya sobreescritos) y flex-1 flex-col (para
    // seguir ocupando el mismo lugar que antes ocupaba <body> directamente).
    <EditModeProvider isAdmin={isAdminUser}>
      <div className="flex flex-1 flex-col bg-bg text-fg" style={themeStyle}>
        {header}
        <main className="flex-1">{children}</main>
        {footer}
      </div>
      <EditModeToggle />
    </EditModeProvider>
  );
}
