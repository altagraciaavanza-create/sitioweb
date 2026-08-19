import { Section } from "@/components/ui/Section";
import { TopicCard } from "@/components/ui/TopicCard";
import { getPublishedTopics } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/ideas",
  title: "Ideas",
  description: "Ideas y propuestas de Alta Gracia Avanza organizadas por eje temático.",
});

export default async function IdeasPage() {
  const topics = await getPublishedTopics();

  return (
    <Section tone="default">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          Ideas para Alta Gracia
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Nuestra agenda de propuestas, organizada por eje temático.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </Section>
  );
}
