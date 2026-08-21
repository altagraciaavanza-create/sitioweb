/**
 * Crea (o actualiza la contraseña de) el usuario admin del panel.
 *
 * Uso:
 *   npx tsx scripts/seed-admin.ts <usuario> <contraseña>
 *
 * Requiere DATABASE_URL configurada en .env.local (o en el entorno).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config(); // fallback: .env, sin pisar lo ya cargado

// Import dinámico A PROPÓSITO: un "import" estático de ../src/db se
// resuelve (require) antes de que corran las líneas de arriba —tsx/esbuild
// mueven los imports estáticos al principio del archivo—, así que
// DATABASE_URL todavía no existiría cuando se arma la conexión. Con
// import() dinámico, en cambio, se ejecuta en el orden real del código,
// después de cargar .env.local.
async function main() {
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../src/db");
  const { adminUsers } = await import("../src/db/schema");
  const { hashPassword } = await import("../src/lib/password");

  const [username, password] = process.argv.slice(2);

  if (!username || !password) {
    console.error("Uso: npx tsx scripts/seed-admin.ts <usuario> <contraseña>");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("La contraseña debe tener al menos 8 caracteres.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const [existing] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));

  if (existing) {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, existing.id));
    console.log(`Contraseña actualizada para el usuario "${username}".`);
  } else {
    await db.insert(adminUsers).values({ username, passwordHash });
    console.log(`Usuario admin "${username}" creado correctamente.`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
