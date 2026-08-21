import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { getNavItems, getSiteSettings, getActiveBrandTheme } from "@/lib/content";

export async function Header() {
  const [mainNav, headerCtaItems, settings, activeTheme] = await Promise.all([
    getNavItems("main"),
    getNavItems("header_cta"),
    getSiteSettings(),
    getActiveBrandTheme(),
  ]);
  const headerCta = headerCtaItems[0] ?? { label: "Sumate", href: "/participa" };
  const siteName = settings?.name ?? "Alta Gracia Avanza";
  const logoUrl = activeTheme?.design.logoUrl ?? null;
  const headerDisplay = activeTheme?.design.headerDisplay ?? "name";
  const showLogo = logoUrl && headerDisplay !== "name";
  const showName = !logoUrl || headerDisplay !== "logo";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-fg focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          {showLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
          ) : null}
          {showName ? <span>{siteName}</span> : <span className="sr-only">{siteName}</span>}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {mainNav.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="text-sm font-medium text-fg-muted transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href={headerCta.href} size="md">
            {headerCta.label}
          </Button>
        </div>

        <MobileMenu items={mainNav} cta={headerCta} />
      </div>
    </header>
  );
}
