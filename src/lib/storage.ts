import "server-only";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "uploads";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

let bucketReady: Promise<void> | null = null;

async function ensureBucket(supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>) {
  if (!bucketReady) {
    bucketReady = (async () => {
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some((b) => b.name === BUCKET);
      if (!exists) {
        const { error } = await supabase.storage.createBucket(BUCKET, {
          public: true,
          fileSizeLimit: MAX_SIZE_BYTES,
        });
        // Si otra request lo creó justo antes, ignoramos el error de "ya existe".
        if (error && !/already exists/i.test(error.message)) {
          throw new Error(`No se pudo crear el bucket de almacenamiento: ${error.message}`);
        }
      }
    })();
  }
  return bucketReady;
}

/**
 * Sube una imagen a Supabase Storage y devuelve su URL pública.
 * Devuelve null si no hay archivo (o está vacío) o si el storage no está
 * configurado (faltan las variables de Supabase).
 */
export async function uploadImage(file: File | null, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen no puede pesar más de 5MB.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo tiene que ser una imagen.");
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "El almacenamiento de imágenes no está configurado (faltan las variables de Supabase)."
    );
  }

  await ensureBucket(supabase);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${crypto.randomUUID()}.${ext || "jpg"}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) {
    throw new Error(`No se pudo subir la imagen: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
