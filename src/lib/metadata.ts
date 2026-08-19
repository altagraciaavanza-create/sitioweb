import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

/**
 * Helper central para construir metadata por página, con valores por
 * defecto tomados de la configuración institucional.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const resolvedTitle = title ?? siteConfig.defaultMetadata.title;
  const resolvedDescription =
    description ?? siteConfig.defaultMetadata.description;
  const url = new URL(path, siteConfig.url).toString();
  const ogImage = image ?? siteConfig.defaultMetadata.ogImage;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
  };
}
