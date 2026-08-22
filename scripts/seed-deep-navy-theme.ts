/**
 * Crea (si no existe) un perfil de identidad visual "Deep Navy" con la
 * paleta de la guía de marca (ver DEEP_NAVY_PRESET_COLORS en
 * src/db/theme.ts) y lo activa como diseño del sitio público — el mismo
 * efecto que entrar a /admin/identidad, crear un perfil desde el preset
 * "Deep Navy" y aplicarlo, pero hecho por script para no tener que repetir
 * los 14 colores a mano.
 *
 * Idempotente: si ya existe un perfil llamado "Deep Navy" no crea uno
 * nuevo — sólo se asegura de que esté activo.
 *
 * Uso:
 *   npx tsx scripts/seed-deep-navy-theme.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

async function main() {
  const { eq } = await import("drizzle-orm");
  const { db, isDbConfigured } = await import("../src/db");
  const { brandThemes, siteSettings } = await import("../src/db/schema");
  const { DEEP_NAVY_PRESET_COLORS } = await import("../src/db/theme");

  if (!isDbConfigured) {
    console.error("Falta DATABASE_URL en .env.local.");
    process.exit(1);
  }

  let [theme] = await db.select().from(brandThemes).where(eq(brandThemes.name, "Deep Navy"));

  if (!theme) {
    [theme] = await db
      .insert(brandThemes)
      .values({
        name: "Deep Navy",
        colors: DEEP_NAVY_PRESET_COLORS,
        fontFamily: "nexa",
      })
      .returning();
    console.log(`Perfil "Deep Navy" creado (id: ${theme.id}).`);
  } else {
    console.log(`Perfil "Deep Navy" ya existía (id: ${theme.id}), no lo toco.`);
  }

  const [settingsRow] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));

  if (settingsRow?.activeBrandThemeId === theme.id) {
    console.log("Deep Navy ya estaba activo en el sitio público.");
  } else {
    await db
      .update(siteSettings)
      .set({ activeBrandThemeId: theme.id, updatedAt: new Date() })
      .where(eq(siteSettings.id, 1));
    console.log("Deep Navy activado como diseño del sitio público.");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
