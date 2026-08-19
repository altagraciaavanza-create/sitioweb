import { Section } from "@/components/ui/Section";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/vision",
  title: "Alta Gracia que queremos",
  description: "La visión de ciudad de Alta Gracia Avanza.",
});

const affirmations = [
  "Una Municipalidad que resuelva problemas en lugar de agregar trámites.",
  "Una ciudad donde emprender y abrir un comercio sea más sencillo.",
  "Una administración donde el vecino pueda conocer cómo se utilizan los recursos públicos.",
  "Una Alta Gracia que genere oportunidades para quienes quieren construir su futuro en la ciudad.",
];

export default function VisionPage() {
  return (
    <Section tone="default">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          La Alta Gracia que queremos
        </h1>
        <div className="mt-12 space-y-10">
          {affirmations.map((text) => (
            <p
              key={text}
              className="border-l-4 border-brand-500 pl-6 text-2xl font-semibold leading-snug text-fg md:text-3xl"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
