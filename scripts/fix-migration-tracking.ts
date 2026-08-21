/**
 * Arregla la tabla de control de migraciones (drizzle.__drizzle_migrations)
 * para casos donde una migración ya se aplicó a la base "a mano" (por
 * ejemplo, pegada en el SQL Editor de Supabase) pero Drizzle no se enteró.
 *
 * Sin esto, "npm run db:migrate:direct" vuelve a intentar correr esa
 * migración vieja de punta a punta y falla con errores tipo
 * "column ... already exists".
 *
 * Uso:
 *   npx tsx scripts/fix-migration-tracking.ts <tag_de_la_migracion>
 *
 * Ejemplo:
 *   npx tsx scripts/fix-migration-tracking.ts 0001_add_team_whatsapp
 *
 * No modifica ninguna tabla del sitio (equipo, páginas, etc.), solo la
 * tabla interna de Drizzle que lleva la cuenta de qué migraciones corrieron.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

async function main() {
  const fs = await import("node:fs");
  const crypto = await import("node:crypto");
  const postgresModule = await import("postgres");
  const postgres = postgresModule.default;

  const tag = process.argv[2];
  if (!tag) {
    console.error("Uso: npx tsx scripts/fix-migration-tracking.ts <tag_de_la_migracion>");
    console.error("Ejemplo: npx tsx scripts/fix-migration-tracking.ts 0001_add_team_whatsapp");
    process.exit(1);
  }

  const migrationsFolder = "./src/db/migrations";
  const journalPath = `${migrationsFolder}/meta/_journal.json`;
  const journal = JSON.parse(fs.readFileSync(journalPath).toString());
  const entry = journal.entries.find((e: { tag: string }) => e.tag === tag);
  if (!entry) {
    console.error(`No encontré "${tag}" en ${journalPath}.`);
    console.error("Tags disponibles:", journal.entries.map((e: { tag: string }) => e.tag).join(", "));
    process.exit(1);
  }

  const sqlFilePath = `${migrationsFolder}/${tag}.sql`;
  const fileContent = fs.readFileSync(sqlFilePath).toString();
  const hash = crypto.createHash("sha256").update(fileContent).digest("hex");

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Falta DATABASE_URL en .env.local.");
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1, prepare: false });

  await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await sql`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;

  const existing = await sql`
    SELECT id FROM drizzle.__drizzle_migrations WHERE hash = ${hash}
  `;

  if (existing.length > 0) {
    console.log(`"${tag}" ya estaba marcada como aplicada. No hice nada.`);
  } else {
    await sql`
      INSERT INTO drizzle.__drizzle_migrations ("hash", "created_at")
      VALUES (${hash}, ${entry.when})
    `;
    console.log(`Listo: marqué "${tag}" como ya aplicada (sin tocar tus tablas).`);
  }

  await sql.end({ timeout: 5 });
  process.exit(0);
}

main().catch((error) => {
  console.error("\nERROR:\n");
  console.error(error);
  process.exit(1);
});
