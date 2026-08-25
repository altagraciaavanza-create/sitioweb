import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { getPublishedTopics, getTopicBySlug } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
  const topics = await getPublishedTopics();
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata(props: PageProps<"/ideas/[slug]">) {
  const { slug } = await props.params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return buildMetadata({ path: `/ideas/${slug}` });
  return buildMetadata({
    path: `/ideas/${topic.slug}`,
    title: topic.title,
    description: topic.summary,
  });
}

export default async function TopicPage(props: PageProps<"/ideas/[slug]">) {
  const { slug } = await props.params;
  const topic = await getTopicBySlug(slug);

  if (!topic) notFound();

  const blocks = [
    { label: "Problema", text: topic.problem },
    { label: "Diagnóstico", text: topic.diagnosis },
    { label: "Propuesta", text: topic.proposal },
    { label: "Impacto esperado", text: topic.expectedImpact },
  ].filter((b) => b.text);

  return (
    <Section tone="default">
      <div className="mx-auto max-w-3xl">
        <Badge tone="brand">Ideas para Alta Gracia</Badge>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          {topic.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-fg-muted">
          {topic.summary}
        </p>

        {blocks.length > 0 ? (
          <div className="mt-12 space-y-8">
            {blocks.map((block) => (
              <div key={block.label}>
                <h2 className="text-sm font-semibold tracking-wide text-brand-600 uppercase">
                  {block.label}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-fg-muted">
                  {block.text}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
