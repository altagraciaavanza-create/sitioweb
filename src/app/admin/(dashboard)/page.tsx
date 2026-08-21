import Link from "next/link";
import { isDbConfigured } from "@/db";

const shortcuts = [
  { href: "/admin/pages", label: "Editar páginas", description: "Armá y reordená los bloques de cada página del sitio." },
  { href: "/admin/menu", label: "Editar menú", description: "Ítems del header y del footer." },
  { href: "/admin/team", label: "Equipo", description: "Integrantes que se muestran en /equipo." },
  { href: "/admin/posts", label: "Actualidad", description: "Novedades, reuniones y comunicados." },
  { href: "/admin/events", label: "Agenda", description: "Próximas actividades." },
  { href: "/admin/topics", label: "Ideas", description: "Ejes temáticos y propuestas." },
  { href: "/admin/participation", label: "Participá", description: "Formas de sumarse al espacio." },
  { href: "/admin/content-types", label: "Tipos de contenido", description: "Creá secciones nuevas sin código: Prensa, FAQ, etc." },
  { href: "/admin/forms", label: "Formularios", description: "Encuestas, inscripciones y otros formularios para vecinos." },
  { href: "/admin/settings", label: "Configuración del sitio", description: "Contacto, redes sociales, datos institucionales." },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-fg">Panel de administración</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Gestioná el contenido de Alta Gracia Avanza.
      </p>

      {!isDbConfigured ? (
        <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          La base de datos todavía no está conectada (falta <code>DATABASE_URL</code> en
          las variables de entorno). El sitio público sigue funcionando con contenido
          estático, pero los cambios que hagas acá no se van a guardar hasta que se
          conecte Supabase.
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.href}
            href={shortcut.href}
            className="rounded-lg border border-border bg-white p-5 transition-shadow hover:shadow-md"
          >
            <h2 className="text-sm font-semibold text-fg">{shortcut.label}</h2>
            <p className="mt-1 text-xs text-fg-muted">{shortcut.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
