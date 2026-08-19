import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Button } from "@/components/ui/Button";
import { getPublishedPosts } from "@/lib/content";
import type { BlockContent } from "@/db/blocks";

export async function ArticleGridBlock({
  content,
}: {
  content: BlockContent<"article_grid">;
}) {
  const { title, description, limit, ctaLabel, ctaHref } = content;
  const posts = await getPublishedPosts(limit);

  return (
    <Section tone="subtle">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-fg md:text-4xl">
            {title}
          </h2>
          {description ? <p className="mt-3 text-lg text-fg-muted">{description}</p> : null}
        </div>
        {ctaLabel && ctaHref ? (
          <Button href={ctaHref} variant="secondary">
            {ctaLabel}
          </Button>
        ) : null}
      </div>
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.slug} update={post} />
        ))}
      </div>
    </Section>
  );
}
