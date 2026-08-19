import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { getPublishedPosts, getPostBySlug } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { buildMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/actualidad/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return buildMetadata({ path: `/actualidad/${slug}` });
  return buildMetadata({
    path: `/actualidad/${post.slug}`,
    title: post.title,
    description: "excerpt" in post ? post.excerpt : undefined,
  });
}

export default async function UpdatePage(props: PageProps<"/actualidad/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const dateIso =
    "publishedAt" in post && post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : "date" in post
        ? post.date
        : new Date().toISOString();

  const category = "category" in post ? post.category : "comunicados";
  const excerpt = "excerpt" in post ? post.excerpt : "";
  const body = "body" in post ? post.body : null;

  return (
    <Section tone="default">
      <div className="mx-auto max-w-2xl">
        <Badge tone="neutral">{category}</Badge>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
          {post.title}
        </h1>
        <time dateTime={dateIso} className="mt-3 block text-sm text-fg-muted">
          {formatDate(dateIso)}
        </time>
        <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-fg-muted">
          {body || excerpt}
        </div>
      </div>
    </Section>
  );
}
