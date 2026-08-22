import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { PrinciplesSection } from "@/components/home/PrinciplesSection";
import { AgendaSection } from "@/components/home/AgendaSection";
import { CurrentActivity } from "@/components/home/CurrentActivity";
import { ParticipationCallout } from "@/components/home/ParticipationCallout";
import { JoinSection } from "@/components/home/JoinSection";
import { PageRenderer } from "@/components/blocks/PageRenderer";
import { getPublishedPageBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/",
  description:
    "Alta Gracia Avanza: una ciudad más libre, transparente, moderna y con oportunidades se construye participando.",
});

export default async function Home() {
  // La home es una página del page builder con slug "" (vacío). Si todavía
  // no existe en la base de datos (o no hay DB configurada), se muestra la
  // versión estática de la Etapa 1 como fallback.
  const page = await getPublishedPageBySlug("");

  if (page) {
    return <PageRenderer pageId={page.id} blocks={page.blocks} />;
  }

  return (
    <>
      <Hero />
      <Intro />
      <PrinciplesSection />
      <AgendaSection />
      <CurrentActivity />
      <ParticipationCallout />
      <JoinSection />
    </>
  );
}
