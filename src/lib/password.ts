import bcrypt from "bcryptjs";

/**
 * Utilidades de hashing de contraseñas, separadas de src/lib/auth.ts para
 * que puedan usarse desde scripts de Node "sueltos" (como
 * scripts/seed-admin.ts) sin arrastrar "server-only" / next/headers, que
 * solo funcionan dentro del runtime de Next.js.
 */
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
