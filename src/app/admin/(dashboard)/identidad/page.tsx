import { asc } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { brandThemes, siteSettings } from "@/db/schema";
import { AdminPageHeader, AdminEmpty, AdminInfoBox } from "@/components/admin/admin-ui";
import { ThemeManager } from "./ThemeManager";
import type { ThemeColors, ThemeFontFamily, ThemeShape, ThemeShadowStyle, ThemeHeaderDisplay } from "@/db/theme";

export default async function AdminIdentidadPage() {
  const [items, [settings]] = isDbConfigured
    ? await Promise.all([
        db.select().from(brandThemes).orderBy(asc(brandThemes.name)),
        db.select({ activeBrandThemeId: siteSettings.activeBrandThemeId }).from(siteSettings),
      ])
    : [[], [undefined]];

  return (
    <div>
      <AdminPageHeader
        title="Identidad visual"
        description="Diseñá perfiles de colores y tipografía para el sitio público, guardalos y aplicá el que quieras cuando quieras."
      />

      <AdminInfoBox title="¿Cómo funciona esto?">
        <p>
          Un <strong>perfil</strong> es un conjunto de colores (y una tipografía) para todo el sitio público.
          Podés crear varios, editarlos, y tener guardado más de uno a la vez — pero solo uno puede estar{" "}
          <strong>aplicado</strong> en cada momento.
        </p>
        <p>
          Cambiar de perfil (o volver al &quot;Diseño original&quot;) es inmediato y totalmente reversible: no
          borra nada, solo cambia qué perfil se está usando. El panel de administración nunca cambia de
          aspecto, sea cual sea el perfil aplicado.
        </p>
      </AdminInfoBox>

      {!isDbConfigured ? (
        <AdminEmpty>Conectá la base de datos para gestionar la identidad visual.</AdminEmpty>
      ) : (
        <ThemeManager
          items={items.map((t) => ({
            id: t.id,
            name: t.name,
            colors: t.colors as ThemeColors,
            fontFamily: t.fontFamily as ThemeFontFamily,
            shape: t.shape as ThemeShape,
            shadowStyle: t.shadowStyle as ThemeShadowStyle,
            typeScale: t.typeScale,
            density: t.density,
            logoUrl: t.logoUrl,
            headerDisplay: t.headerDisplay as ThemeHeaderDisplay,
          }))}
          activeThemeId={settings?.activeBrandThemeId ?? null}
        />
      )}
    </div>
  );
}
