import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Next.js carga .env.local automáticamente, pero drizzle-kit (fuera de
// Next) no lo hace por defecto — dotenv/config solo mira .env. Cargamos
// .env.local explícitamente (con fallback a .env) para que "npm run
// db:generate/migrate/studio" usen las mismas variables que "npm run dev".
config({ path: ".env.local" });
config(); // fallback: .env, sin pisar lo ya cargado

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL no está configurada. Copiá .env.local.example a .env.local y completá la connection string de Supabase."
  );
}

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;
