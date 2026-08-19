import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { getNavItems, getSiteSettings } from "@/lib/content";

export async function Header() {
  const [mainNav, headerCtaItems, settings] = await Promise.all([
    getNavItems("main"),
    getNavItems("header_cta"),
    getSiteSettings(),
  ]);
  const headerCta = headerCtaItems[0] ?? { label: "Sumate", href: "/participa" };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-fg focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          {settings?.name ?? "Alta Gracia Avanza"}
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
