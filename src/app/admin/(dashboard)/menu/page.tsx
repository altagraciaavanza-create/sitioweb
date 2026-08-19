import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { navItems } from "@/db/schema";
import {
  AdminPageHeader,
  AdminCard,
  AdminEmpty,
  AdminField,
  AdminInput,
  AdminButton,
} from "@/components/admin/admin-ui";
import { createNavItem, deleteNavItem, moveNavItem, updateNavItemLabelHref } from "./actions";

const locations = [
  { value: "main", label: "Menú principal (header)" },
  { value: "header_cta", label: "Botón destacado del header" },
  { value: "footer", label: "Footer" },
] as const;

export default async function AdminMenuPage() {
  const items = isDbConfigured
    ? await db.select().from(navItems).orderBy(asc(navItems.order))
    : [];

  return (
    <div>
      <AdminPageHeader
        title="Menú"
        description="Ítems de navegación del header y el footer."
      />

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para editar el menú.</AdminEmpty>
      ) : (
        <div className="space-y-10">
          {locations.map((loc) => {
            const locItems = items.filter((i) => i.location === loc.value);
            return (
              <div key={loc.value}>
                <h2 className="text-sm font-semibold text-fg">{loc.label}</h2>

                <div className="mt-3 space-y-2">
                  {locItems.length === 0 ? (
                    <p className="text-sm text-fg-muted">Sin ítems todavía.</p>
                  ) : (
                    locItems.map((item, index) => (
                      <AdminCard key={item.id} className="flex flex-wrap items-center gap-3 py-3">
                        <form action={updateNavItemLabelHref.bind(null, item.id)} className="flex flex-1 flex-wrap gap-3">
                          <AdminInput name="label" defaultValue={item.label} className="mt-0 w-40" />
                          <AdminInput name="href" defaultValue={item.href} className="mt-0 flex-1" />
                          <AdminButton type="submit" variant="secondary">
                            Guardar
                          </AdminButton>
                        </form>

                        <div className="flex items-center gap-1">
                          <form action={moveNavItem.bind(null, item.id, "up")}>
                            <button
                              type="submit"
                              disabled={index === 0}
                              className="rounded-md border border-border px-2 py-1 text-xs text-fg-muted hover:bg-bg-subtle disabled:opacity-30"
                              aria-label="Mover arriba"
                            >
                              ↑
                            </button>
                          </form>
                          <form action={moveNavItem.bind(null, item.id, "down")}>
                            <button
                              type="submit"
                              disabled={index === locItems.length - 1}
                              className="rounded-md border border-border px-2 py-1 text-xs text-fg-muted hover:bg-bg-subtle disabled:opacity-30"
                              aria-label="Mover abajo"
                            >
                              ↓
                            </button>
                          </form>
                          <form action={deleteNavItem.bind(null, item.id)}>
                            <button type="submit" className="ml-2 text-xs text-red-600 hover:underline">
                              Eliminar
                            </button>
                          </form>
                        </div>
                      </AdminCard>
                    ))
                  )}
                </div>

                <form action={createNavItem} className="mt-4 flex flex-wrap items-end gap-3">
                  <input type="hidden" name="location" value={loc.value} />
                  <AdminField label="Etiqueta" htmlFor={`label-${loc.value}`}>
                    <AdminInput id={`label-${loc.value}`} name="label" required className="w-40" />
                  </AdminField>
                  <AdminField label="Link" htmlFor={`href-${loc.value}`}>
                    <AdminInput id={`href-${loc.value}`} name="href" required placeholder="/ruta" className="w-56" />
                  </AdminField>
                  <AdminButton type="submit" variant="secondary">
                    Agregar ítem
                  </AdminButton>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
