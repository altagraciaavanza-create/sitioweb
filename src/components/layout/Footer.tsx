import Link from "next/link";
import { siteConfig, getWhatsappLink } from "@/data/site";
import { getNavItems, getSiteSettings } from "@/lib/content";

export async function Footer() {
  const [footerNav, settings] = await Promise.all([
    getNavItems("footer"),
    getSiteSettings(),
  ]);
  const year = new Date().getFullYear();
  const name = settings?.name ?? siteConfig.name;
  const description = settings?.description ?? siteConfig.description;
  const email = settings?.contactEmail ?? siteConfig.contact.email;
  const whatsappNumber = settings?.whatsappNumber ?? siteConfig.contact.whatsapp.phoneNumber;
  const whatsappMessage =
    settings?.whatsappMessage ?? siteConfig.contact.whatsapp.defaultMessage;
  const whatsappDisplay = siteConfig.contact.whatsapp.displayNumber;
  const instagramUrl = settings?.instagramUrl ?? siteConfig.social.instagram;
  const facebookUrl = settings?.facebookUrl ?? siteConfig.social.facebook;

  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="text-lg font-bold text-fg">{name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
            {description}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-fg">Navegación</h3>
          <ul className="mt-4 space-y-2">
            {footerNav.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className="text-sm text-fg-muted hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-fg">Contacto</h3>
          <ul className="mt-4 space-y-2 text-sm text-fg-muted">
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="hover:text-fg">
                  {email}
                </a>
              </li>
            ) : null}
            {whatsappNumber ? (
              <li>
                <a
                  href={getWhatsappLink(whatsappMessage ?? undefined)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fg"
                >
                  WhatsApp: {whatsappDisplay}
                </a>
              </li>
            ) : null}
            {instagramUrl ? (
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fg"
                >
                  Instagram
                </a>
              </li>
            ) : null}
            {facebookUrl ? (
              <li>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fg"
                >
                  Facebook
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-fg-muted md:flex-row md:px-8">
          <p>
            © {year} {name}. Todos los derechos reservados.
          </p>
          <Link href="/transparencia" className="hover:text-fg">
            Aviso de privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
