import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";
import { topics } from "@/data/topics";
import { latestUpdates } from "@/data/updates";

const staticRoutes = [
  "/",
  "/nosotros",
  "/ideas",
  "/vision",
  "/participa",
  "/equipo",
  "/actualidad",
  "/agenda",
  "/transparencia",
  "/propuestas",
  "/contacto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified: new Date(),
  }));

  const topicEntries: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: new URL(`/ideas/${topic.slug}`, siteConfig.url).toString(),
    lastModified: new Date(),
  }));

  const updateEntries: MetadataRoute.Sitemap = latestUpdates.map((update) => ({
    url: new URL(`/actualidad/${update.slug}`, siteConfig.url).toString(),
    lastModified: update.date,
  }));

  return [...staticEntries, ...topicEntries, ...updateEntries];
}
