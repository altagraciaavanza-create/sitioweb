import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Layout raíz de /admin/* (envuelve tanto /admin/login y /admin/logout
 * como el grupo de rutas con sidebar en (dashboard)/layout.tsx). Solo
 * existe para marcar todo el panel como no indexable — antes no había
 * ningún noindex acá ni en robots.txt, así que buscadores y bots podían
 * rastrear e indexar /admin/* con normalidad (ver guía de actualización,
 * "Investigar tráfico repetido a /admin/*").
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
