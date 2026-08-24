import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

/**
 * Mientras no haya credenciales de Supabase configuradas (DATABASE_URL),
 * el sitio sigue funcionando con el contenido estático de src/data/*.ts —
 * ver src/lib/content.ts, que usa este flag para decidir de dónde leer.
 * Esto permite seguir desarrollando/deployando sin bloquear todo a que la
 * base de datos exista.
 */
export const isDbConfigured = Boolean(connectionString);

// `max: 1` es la recomendación oficial de Supabase para funciones
// serverless: cada invocación (Vercel crea una función por request) abre su
// propio proceso y, sin este límite, cada una intenta abrir hasta 10
// conexiones (default de postgres.js). Con tráfico concurrente eso agota
// rápido el límite del pooler en modo "Session" (15 clientes) y produce el
// error "MaxClientsInSessionMode" — visto en producción el 2026-08-24,
// tumbando la home y el login del admin de forma intermitente.
const client = connectionString
  ? postgres(connectionString, { prepare: false, max: 1, idle_timeout: 20 })
  : null;

export const db = client ? drizzle(client, { schema }) : (null as never);
