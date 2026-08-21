import type { ReactNode } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages", label: "Páginas" },
  { href: "/admin/menu", label: "Menú" },
  { href: "/admin/team", label: "Equipo" },
  { href: "/admin/posts", label: "Actualidad" },
  { href: "/admin/events", label: "Agenda" },
  { href: "/admin/topics", label: "Ideas" },
  { href: "/admin/participation", label: "Participá" },
  { href: "/admin/content-types", label: "Tipos de contenido" },
  { href: "/admin/forms", label: "Formularios" },
  { href: "/admin/identidad", label: "Identidad visual" },
  { href: "/admin/settings", label: "Configuración" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  // La página de login no usa este layout con sidebar (ver src/app/admin/login).
  // Si por algún motivo llegamos acá sin sesión, el proxy ya debería haber
  // redirigido, pero lo dejamos como segunda barrera defensiva.

  return (
    <div className="flex min-h-screen bg-bg-subtle">
      <aside className="hidden w-64 flex-col border-r border-border bg-white p-6 md:flex">
        <p className="text-sm font-bold text-fg">Alta Gracia Avanza</p>
        <p className="text-xs text-fg-muted">Panel de administración</p>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm font-medium text-fg hover:bg-border/40"
        >
          Ver sitio publicado
        </a>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-fg-muted hover:bg-bg-subtle hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          {session ? (
            <p className="mb-2 text-xs text-fg-muted">Conectado como {session.username}</p>
          ) : null}
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-md border border-border px-3 py-2 text-sm font-medium text-fg-muted hover:bg-bg-subtle"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
