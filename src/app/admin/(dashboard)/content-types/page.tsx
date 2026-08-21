import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { contentTypes } from "@/db/schema";
import { AdminPageHeader, AdminEmpty, AdminInfoBox } from "@/components/admin/admin-ui";
import { ContentTypesManager } from "./ContentTypesManager";
import type { FieldDef } from "@/db/fields";

export default async function AdminContentTypesPage() {
  const items = isDbConfigured ? await db.select().from(contentTypes).orderBy(asc(contentTypes.name)) : [];

  return (
    <div>
      <AdminPageHeader
        title="Tipos de contenido"
        description="Creá secciones nuevas (como Prensa, FAQ, etc.) sin escribir código, y mostralas en cualquier página con el bloque 'Lista de contenido'."
      />

      <AdminInfoBox title="¿Para qué sirve esto y cómo se usa?">
        <p>
          Un <strong>tipo de contenido</strong> es un molde para una sección repetible del sitio: cada tipo
          define qué datos tiene (por ejemplo, título, imagen, fecha) y después vos cargás tantas{" "}
          <strong>entradas</strong> como quieras con ese molde, como filas de una tabla.
        </p>
        <p>Ejemplo: si querés armar una sección de &quot;Prensa&quot;, el flujo es:</p>
        <ol>
          <li>
            Tocá <strong>&quot;Nuevo tipo&quot;</strong> y definí sus campos (ej: título, medio, fecha, enlace).
            El primer campo que agregues se usa como título en los listados.
          </li>
          <li>
            Entrá a <strong>&quot;Entradas&quot;</strong> del tipo que creaste y cargá una nota de prensa por
            vez, completando esos campos.
          </li>
          <li>
            Andá a <strong>Páginas</strong>, elegí la página donde querés mostrarlas, agregá un bloque{" "}
            <strong>&quot;Lista de contenido&quot;</strong> y elegí ese tipo. Listo, ya aparece en el sitio.
          </li>
        </ol>
        <p>
          Podés crear tantos tipos como necesites (Prensa, Preguntas frecuentes, Testimonios, etc.), cada uno
          con sus propios campos, sin que nadie tenga que tocar código.
        </p>
      </AdminInfoBox>

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar tipos de contenido.</AdminEmpty>
      ) : (
        <ContentTypesManager
          items={items.map((type) => ({ ...type, fields: type.fields as FieldDef[] }))}
        />
      )}
    </div>
  );
}
