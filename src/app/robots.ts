import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El panel de administración no debe ser rastreado ni indexado (ver
      // también el noindex en src/app/admin/layout.tsx, como segunda
      // barrera para buscadores que no respeten robots.txt).
      disallow: ["/admin"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
