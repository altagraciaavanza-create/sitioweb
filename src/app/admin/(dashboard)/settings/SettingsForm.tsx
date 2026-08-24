"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import { updateSiteSettings, uploadOgImage, type SettingsFormState } from "./actions";

type Settings = {
  name?: string | null;
  tagline?: string | null;
  description?: string | null;
  contactEmail?: string | null;
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
  ogImageUrl?: string | null;
} | null;

const initialState: SettingsFormState = {};

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5 border-t border-border pt-6 first:border-t-0 first:pt-0">
      <div>
        <h2 className="text-base font-semibold text-fg">{title}</h2>
        {description ? <p className="mt-1 text-sm text-fg-muted">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initialState);
  const { toast } = useToast();
  const notified = useRef<SettingsFormState | null>(null);

  const [ogImageUrl, setOgImageUrl] = useState<string | null>(settings?.ogImageUrl ?? null);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);
  const [ogUploadPending, startOgUploadTransition] = useTransition();
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === notified.current) return;
    notified.current = state;
    if (state.success) {
      toast({ variant: "success", title: "Configuración guardada" });
    } else if (state.error) {
      toast({ variant: "danger", title: "No se pudo guardar", description: state.error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleOgImageChange(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setUploadingOgImage(true);
    const formData = new FormData();
    formData.set("ogImage", file);
    startOgUploadTransition(async () => {
      const result = await uploadOgImage(formData);
      setUploadingOgImage(false);
      if (result.error) {
        toast({ variant: "danger", title: "No se pudo subir la imagen", description: result.error });
        return;
      }
      if (result.url) {
        setOgImageUrl(result.url);
        toast({ variant: "success", title: "Imagen subida", description: "Guardá los cambios para aplicarla." });
      }
    });
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <SettingsSection title="Datos institucionales">
        <AdminField label="Nombre del espacio" htmlFor="name">
          <AdminInput id="name" name="name" required defaultValue={settings?.name ?? "Alta Gracia Avanza"} />
        </AdminField>

        <AdminField label="Bajada / tagline" htmlFor="tagline">
          <AdminInput id="tagline" name="tagline" defaultValue={settings?.tagline ?? ""} />
        </AdminField>

        <AdminField label="Descripción institucional" htmlFor="description">
          <AdminTextarea id="description" name="description" rows={3} defaultValue={settings?.description ?? ""} />
        </AdminField>
      </SettingsSection>

      <SettingsSection title="Contacto">
        <AdminField label="Email de contacto" htmlFor="contactEmail">
          <AdminInput id="contactEmail" name="contactEmail" type="email" defaultValue={settings?.contactEmail ?? ""} />
        </AdminField>

        <AdminField
          label="WhatsApp (solo números, código de país incluido)"
          htmlFor="whatsappNumber"
          hint="Ejemplo: 5493547000000"
        >
          <AdminInput id="whatsappNumber" name="whatsappNumber" defaultValue={settings?.whatsappNumber ?? ""} />
        </AdminField>

        <AdminField label="Mensaje predefinido de WhatsApp" htmlFor="whatsappMessage">
          <AdminInput id="whatsappMessage" name="whatsappMessage" defaultValue={settings?.whatsappMessage ?? ""} />
        </AdminField>
      </SettingsSection>

      <SettingsSection title="Redes sociales">
        <AdminField label="Instagram (URL)" htmlFor="instagramUrl">
          <AdminInput id="instagramUrl" name="instagramUrl" defaultValue={settings?.instagramUrl ?? ""} />
        </AdminField>

        <AdminField label="Facebook (URL)" htmlFor="facebookUrl">
          <AdminInput id="facebookUrl" name="facebookUrl" defaultValue={settings?.facebookUrl ?? ""} />
        </AdminField>

        <AdminField label="Twitter/X (URL, opcional)" htmlFor="twitterUrl">
          <AdminInput id="twitterUrl" name="twitterUrl" defaultValue={settings?.twitterUrl ?? ""} />
        </AdminField>

        <AdminField label="TikTok (URL, opcional)" htmlFor="tiktokUrl">
          <AdminInput id="tiktokUrl" name="tiktokUrl" defaultValue={settings?.tiktokUrl ?? ""} />
        </AdminField>

        <AdminField label="YouTube (URL, opcional)" htmlFor="youtubeUrl">
          <AdminInput id="youtubeUrl" name="youtubeUrl" defaultValue={settings?.youtubeUrl ?? ""} />
        </AdminField>
      </SettingsSection>

      <SettingsSection
        title="Open Graph (vista previa al compartir el link)"
        description="Así se ve el sitio cuando alguien comparte el link en WhatsApp, Instagram, Facebook o Twitter/X."
      >
        <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm text-fg">
          <p>
            El título y la descripción de esa vista previa son los mismos que cargaste en{" "}
            <span className="font-medium">Datos institucionales</span>: &ldquo;Nombre del espacio&rdquo; y
            &ldquo;Descripción institucional&rdquo;. Acá abajo solo falta la imagen.
          </p>
        </div>

        <div>
          <AdminLabelLike>Imagen social por defecto</AdminLabelLike>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {ogImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ogImageUrl}
                alt="Vista previa de la imagen social"
                className="h-24 w-auto rounded border border-border bg-white object-cover"
              />
            ) : (
              <span className="text-xs text-fg-muted">
                Todavía no subiste una imagen; se usa la imagen por defecto del sitio.
              </span>
            )}
            <input
              ref={ogImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleOgImageChange(e.target.files)}
            />
            <AdminButton
              type="button"
              variant="secondary"
              disabled={uploadingOgImage || ogUploadPending}
              onClick={() => ogImageInputRef.current?.click()}
            >
              {uploadingOgImage || ogUploadPending ? "Subiendo..." : ogImageUrl ? "Cambiar imagen" : "Subir imagen"}
            </AdminButton>
            {ogImageUrl ? (
              <button
                type="button"
                onClick={() => setOgImageUrl(null)}
                className="text-sm text-red-600 hover:underline"
              >
                Quitar imagen
              </button>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-fg-muted">
            Recomendado: 1200×630px, menor a 5MB. Se aplica recién al guardar los cambios.
          </p>
          <input type="hidden" name="ogImageUrl" value={ogImageUrl ?? ""} />
        </div>
      </SettingsSection>

      <div className="rounded-lg border border-brand-100 bg-brand-50 p-4">
        <p className="text-sm font-semibold text-fg">¿Buscás cambiar los colores y la tipografía del sitio?</p>
        <p className="mt-1 text-sm text-fg-muted">
          Eso ahora se maneja desde{" "}
          <Link href="/admin/identidad" className="text-brand-700 underline hover:no-underline">
            Identidad visual
          </Link>
          , donde podés crear varios perfiles, verlos en vista previa y aplicar el que quieras.
        </p>
      </div>

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar cambios"}
      </AdminButton>
    </form>
  );
}

function AdminLabelLike({ children }: { children: ReactNode }) {
  return <p className="block text-sm font-medium text-fg">{children}</p>;
}
