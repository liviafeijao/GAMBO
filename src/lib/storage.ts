import { getSupabaseClient } from "@/lib/supabase";

export const ASSETS_BUCKET = "gambo-assets";
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function isStoredAsset(path: string) {
  return Boolean(path) && !path.startsWith("/") && !path.startsWith("http") && !path.startsWith("data:");
}

export async function uploadAsset(file: File, workspaceId: string, folder: "projects" | "references") {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Use uma imagem JPG, PNG, WEBP ou GIF.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("A imagem deve ter no máximo 8 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${workspaceId}/${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await getSupabaseClient().storage.from(ASSETS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function removeAsset(path: string) {
  if (!isStoredAsset(path)) return;
  const { error } = await getSupabaseClient().storage.from(ASSETS_BUCKET).remove([path]);
  if (error) throw error;
}

export async function createAssetUrl(path: string) {
  if (!isStoredAsset(path)) return path;
  const { data, error } = await getSupabaseClient()
    .storage.from(ASSETS_BUCKET)
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}
