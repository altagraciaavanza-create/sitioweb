/**
 * Aplica las migraciones pendientes a la base de datos.
 *
 * Hace lo mismo que "drizzle-kit migrate", pero sin pasar por su CLI:
 * en Windows, esa CLI a veces se cuelga/crashea sin mostrar el error real
 * (problema conocido de su "spinner" de consola). Acá usamos la función
 * migrate() de drizzle-orm directamente, con un try/catch simple que
 * imprime cualquier error de punta a punta.
 *
 * Uso:
 *   npx tsx scripts/migrate.ts
 *
 * Requiere DATABASE_URL configurada en .env.local (o en el entorno).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config(); // fallback: .env, sin pisar lo ya cargado

// Import dinámico A PROPÓSITO (ver scripts/seed-admin.ts para la explicación
// completa): con tsx/esbuild, un import estático se resolvería antes de que
// corran los config() de arriba y DATABASE_URL todavía no existiría.
async function main() {
  const postgresModule = await import("postgres");
  const postgres = postgresModule.default;
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error(
      "Falta DATABASE_URL. Completá .env.local con la connection string de Supabase."
    );
    process.exit(1);
  }

  // max: 1 y prepare: false porque Supabase suele darse con el pooler
  // (pgbouncer, modo transacción), que no soporta muchas conexiones
  // simultáneas ni "prepared statements" persistentes.
  const sql = postgres(connectionString, { max: 1, prepare: false });
  const db = drizzle(sql);

  console.log("Conectando y aplicando migraciones pendientes...");
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Listo: la base de datos está actualizada.");

  await sql.end({ timeout: 5 });
  process.exit(0);
}

main().catch((error) => {
  console.error("\nERROR aplicando migraciones:\n");
  console.error(error);
  process.exit(1);
});
