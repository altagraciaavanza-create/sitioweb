import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { getPublishedTopics, getPublishedPosts } from "@/lib/content";

// Rutas ya en el menú (o accesibles desde el sitio de forma pública).
const staticRoutes = [
  "/",
  "/nosotros",
  "/ideas",
  "/participa",
  "/equipo",
  "/actualidad",
  "/agenda",
  "/transparencia",
  "/contacto",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Antes esto usaba `@/data/topics` y `@/data/updates` (listas estáticas,
  // una de ellas con contenido de ejemplo) en vez de la base de datos real —
  // el sitemap podía quedar desincronizado de lo que realmente existe (ejes
  // borrados/renombrados desde /admin/topics, posts de ejemplo indexados en
  // vez de los reales). Se pasa a usar las mismas funciones que ya usan las
  // páginas públicas (`getPublishedTopics`/`getPublishedPosts`).
  const [topics, posts] = await Promise.all([getPublishedTopics(), getPublishedPosts()]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: new Date(),
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: new URL(`/ideas/${topic.slug}`, siteConfig.url).toString(),
    lastModified: new Date(),
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: new URL(`/actualidad/${post.slug}`, siteConfig.url).toString(),
    lastModified: new Date(post.date),
  }));

  return [...staticEntries, ...topicEntries, ...postEntries];
}
