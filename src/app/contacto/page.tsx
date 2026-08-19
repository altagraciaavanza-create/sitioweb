import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig, getWhatsappLink } from "@/data/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  path: "/contacto",
  title: "Contacto",
  description: "Comunicate con Alta Gracia Avanza.",
});

export default function ContactoPage() {
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
            <li>
              Email:{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-600 hover:underline">
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              WhatsApp:{" "}
              <a
                href={getWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                {siteConfig.contact.whatsapp.displayNumber}
              </a>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
