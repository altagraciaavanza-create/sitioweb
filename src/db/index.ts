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

const client = connectionString ? postgres(connectionString, { prepare: false }) : null;

export const db = client ? drizzle(client, { schema }) : (null as never);
