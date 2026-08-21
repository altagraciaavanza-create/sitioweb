"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
import { useToast } from "@/components/ui/Toast";
import { updateSiteSettings, type SettingsFormState } from "./actions";

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

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initialState);
  const { toast } = useToast();
  const notified = useRef<SettingsFormState | null>(null);

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

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <AdminField label="Nombre del espacio" htmlFor="name">
        <AdminInput id="name" name="name" required defaultValue={settings?.name ?? "Alta Gracia Avanza"} />
      </AdminField>

      <AdminField label="Bajada / tagline" htmlFor="tagline">
        <AdminInput id="tagline" name="tagline" defaultValue={settings?.tagline ?? ""} />
      </AdminField>

      <AdminField label="Descripción institucional" htmlFor="description">
        <AdminTextarea id="description" name="description" rows={3} defaultValue={settings?.description ?? ""} />
      </AdminField>

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

      <AdminField label="Imagen social por defecto (URL, opcional)" htmlFor="ogImageUrl">
        <AdminInput id="ogImageUrl" name="ogImageUrl" defaultValue={settings?.ogImageUrl ?? ""} />
      </AdminField>

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
