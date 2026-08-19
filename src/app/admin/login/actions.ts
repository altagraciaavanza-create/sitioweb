"use server";

import { redirect } from "next/navigation";
import { authenticate } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Completá usuario y contraseña." };
  }

  const result = await authenticate(username, password);

  if (!result.ok) {
    if (result.error === "not_configured") {
      return {
        error:
          "La base de datos todavía no está configurada. Contactá al equipo técnico.",
      };
    }
    return { error: "Usuario o contraseña incorrectos." };
  }

  redirect("/admin");
}
