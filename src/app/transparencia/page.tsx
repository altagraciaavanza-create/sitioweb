import { Section } from "@/components/ui/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/transparencia",
  title: "Transparencia",
  description: "Documentación institucional y de gestión de Alta Gracia Avanza.",
});

// Nota: esta página todavía no tiene ninguna categoría con contenido real
// publicado. Mostrar de entrada una grilla de 11 categorías vacías ("todavía
// no hay documentos en esta categoría" repetido 11 veces) debilita el
// mensaje de transparencia en vez de reforzarlo (ver guía de actualización,
// sección 17). Cuando haya al menos un documento real, esta página debería
// pasar a listar únicamente las categorías que sí tengan contenido — no
// todas de entrada.
export default function TransparenciaPage() {
  return (
    <Section tone="default">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          Transparencia
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          La transparencia no puede ser solamente una promesa. Tiene que ser
          una práctica.
        </p>
      </div>

      <div className="mt-8">
        <EmptyState
          title="Todavía no hay documentación publicada"
          description="Vamos a ir sumando acá la información institucional y de gestión del espacio a medida que esté lista."
        />
      </div>
    </Section>
  );
}
