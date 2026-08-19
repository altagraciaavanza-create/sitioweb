import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { getPublishedPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/actualidad",
  title: "Actualidad",
  description: "Novedades, reuniones y actividades de Alta Gracia Avanza.",
});

export default async function ActualidadPage() {
  const posts = await getPublishedPosts();

  return (
    <Section tone="default">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          Actualidad
        </h1>
        <p className="mt-4 text-lg text-fg-muted">
          Reuniones, actividades y novedades del espacio.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.slug} update={post} />
        ))}
      </div>
    </Section>
  );
}
