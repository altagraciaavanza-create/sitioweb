import { Section } from "@/components/ui/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/transparencia",
  title: "Transparencia",
  description: "Documentación institucional y de gestión de Alta Gracia Avanza.",
});

const categories = [
  "Autoridades",
  "Responsables institucionales",
  "Declaración de principios",
  "Carta orgánica",
  "Documentación partidaria",
  "Aportes",
  "Gastos",
  "Balances",
  "Informes",
  "Normativa",
  "Documentos públicos",
];

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

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category} className="rounded-lg border border-border p-5">
            <h2 className="text-sm font-semibold text-fg">{category}</h2>
            <p className="mt-2 text-xs text-fg-muted">
              Todavía no hay documentos publicados en esta categoría.
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <EmptyState
          title="Publicaremos la documentación a medida que esté disponible"
          description="Nos comprometemos a mantener esta sección actualizada."
        />
      </div>
    </Section>
  );
}
