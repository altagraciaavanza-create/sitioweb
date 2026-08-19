import { Section } from "@/components/ui/Section";
import { TopicCard } from "@/components/ui/TopicCard";
import { topics } from "@/data/topics";

export function AgendaSection() {
  return (
    <Section tone="default">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
            Agenda para Alta Gracia
          </h2>
          <p className="mt-3 text-lg text-fg-muted">
            Los ejes que guían nuestra visión de ciudad.
          </p>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard key={topic.slug} topic={topic} />
        ))}
      </div>
    </Section>
  );
}
