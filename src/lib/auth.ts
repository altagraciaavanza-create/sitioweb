import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/db";
import { adminUsers } from "@/db/schema";
import { verifyPassword } from "./password";

export { hashPassword } from "./password";

const SESSION_COOKIE = "aga_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 horas

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET no está configurada. Generá una con `openssl rand -base64 32` y agregala a .env.local."
    );
  }
  return new TextEncoder().encode(secret);
}

export type AdminSession = {
  sub: string; // user id
  username: string;
};

export async function createSession(payload: AdminSession) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return { sub: payload.sub as string, username: payload.username as string };
  } catch {
    return null;
  }
}

export type AuthResult =
  | { ok: true }
  | { ok: false; error: "not_configured" | "invalid_credentials" };

/** Verifica usuario/contraseña contra admin_users y crea la sesión si es válido. */
export async function authenticate(username: string, password: string): Promise<AuthResult> {
  if (!isDbConfigured) {
    return { ok: false, error: "not_configured" };
  }

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username));

  if (!user) return { ok: false, error: "invalid_credentials" };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, error: "invalid_credentials" };

  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, user.id));

  await createSession({ sub: user.id, username: user.username });
  return { ok: true };
}
