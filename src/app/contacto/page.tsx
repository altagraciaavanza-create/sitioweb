import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig, getWhatsappLink, formatWhatsappDisplay } from "@/data/site";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/content";

export const metadata = buildMetadata({
  path: "/contacto",
  title: "Contacto",
  description: "Comunicate con Alta Gracia Avanza.",
});

export default async function ContactoPage() {
  const settings = await getSiteSettings();
  const email = settings?.contactEmail ?? siteConfig.contact.email;
  const whatsappNumber = settings?.whatsappNumber ?? siteConfig.contact.whatsapp.phoneNumber;
  const whatsappMessage = settings?.whatsappMessage ?? siteConfig.contact.whatsapp.defaultMessage;
  const whatsappDisplay = whatsappNumber
    ? formatWhatsappDisplay(whatsappNumber)
    : siteConfig.contact.whatsapp.displayNumber;

  return (
    <Section tone="default">
      <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-fg md:text-5xl">
            Contacto
          </h1>
          <p className="mt-4 text-lg text-fg-muted">
            Escribinos por el medio que prefieras.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-fg-muted">
            {email ? (
              <li>
                Email:{" "}
                <a href={`mailto:${email}`} className="text-brand-600 hover:underline">
                  {email}
                </a>
              </li>
            ) : null}
            {whatsappNumber ? (
              <li>
                WhatsApp:{" "}
                <a
                  href={getWhatsappLink(whatsappMessage ?? undefined, whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline"
                >
                  {whatsappDisplay}
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
