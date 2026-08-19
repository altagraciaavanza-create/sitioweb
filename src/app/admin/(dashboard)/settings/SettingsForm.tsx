"use client";

import { useActionState } from "react";
import { AdminField, AdminInput, AdminTextarea, AdminButton } from "@/components/admin/admin-ui";
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

      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      {state.success ? <p className="text-sm text-brand-600">Guardado correctamente.</p> : null}

      <AdminButton type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar cambios"}
      </AdminButton>
    </form>
  );
}
