import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ToastProvider } from "@/components/ui/Toast";
import { siteConfig } from "@/data/site";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings, getActiveBrandTheme } from "@/lib/content";
import { nexa } from "@/lib/fonts";
import { getSession } from "@/lib/auth";

// Dinámico (no `export const metadata`) para que el nombre, la descripción
// y la imagen social por defecto salgan de /admin/settings en vez de quedar
// fijos en src/data/site.ts.
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings?.name || siteConfig.name;
  const description = settings?.description || siteConfig.defaultMetadata.description;
  const ogImage = settings?.ogImageUrl || siteConfig.defaultMetadata.ogImage;

  return {
    ...buildMetadata({ title: name, description, image: ogImage }),
    title: {
      default: name,
      template: `%s · ${name}`,
    },
    metadataBase: new URL(siteConfig.url),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [activeTheme, session, settings] = await Promise.all([
    getActiveBrandTheme(),
    getSession(),
    getSiteSettings(),
  ]);

  // Datos estructurados (schema.org Organization) para que buscadores
  // entiendan qué es el sitio — nombre, logo, contacto, redes — más allá
  // del title/description sueltos. Ver guía de actualización, sección 24
  // ("metadata coherente"). Todo sale de configuración real ya existente
  // (site.ts / /admin/settings), no se inventa ningún dato acá; cada campo
  // de contacto/red social solo se incluye si de verdad está configurado.
  const orgName = settings?.name || siteConfig.name;
  const orgDescription = settings?.description || siteConfig.description;
  const email = settings?.contactEmail || siteConfig.contact.email;
  const sameAs = [
    settings?.instagramUrl || siteConfig.social.instagram,
    settings?.facebookUrl || siteConfig.social.facebook,
    settings?.twitterUrl || siteConfig.social.twitter,
    settings?.tiktokUrl || siteConfig.social.tiktok,
    settings?.youtubeUrl || siteConfig.social.youtube,
  ].filter((url): url is string => Boolean(url));
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: orgName,
    url: siteConfig.url,
    description: orgDescription,
    ...(activeTheme?.design.logoUrl
      ? { logo: new URL(activeTheme.design.logoUrl, siteConfig.url).toString() }
      : null),
    ...(sameAs.length ? { sameAs } : null),
    ...(email
      ? { contactPoint: [{ "@type": "ContactPoint", email, contactType: "customer support" }] }
      : null),
  };

  return (
    <html lang="es" className={`h-full antialiased ${nexa.variable}`}>
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ToastProvider>
          <SiteChrome
            header={<Header />}
            footer={<Footer />}
            activeTheme={activeTheme}
            isAdminUser={Boolean(session)}
          >
            {children}
          </SiteChrome>
        </ToastProvider>
      </body>
    </html>
  );
}
