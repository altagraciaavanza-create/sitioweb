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
  const [activeTheme, session] = await Promise.all([getActiveBrandTheme(), getSession()]);

  return (
    <html lang="es" className={`h-full antialiased ${nexa.variable}`}>
      <body className="flex min-h-full flex-col bg-bg text-fg">
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
