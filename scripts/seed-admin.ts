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

import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { adminUsers } from "../src/db/schema";
import { hashPassword } from "../src/lib/password";

async function main() {
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
