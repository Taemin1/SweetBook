import { getSupabaseClient } from "./supabase";

const BUCKET = "entry-photos";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** 업로드 전 검증. 문제가 있으면 사용자에게 보여줄 메시지를, 없으면 null을 반환. */
export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "사진은 JPG, PNG, WEBP, GIF 형식만 올릴 수 있어요.";
  }
  if (file.size > MAX_SIZE) {
    return "사진은 5MB 이하만 올릴 수 있어요.";
  }
  return null;
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return file.type.split("/")[1] ?? "jpg";
}

export async function uploadEntryPhoto(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const path = `${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);
  return path;
}

export async function deleteEntryPhoto(path: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.storage.from(BUCKET).remove([path]);
}

export function getEntryPhotoUrl(path: string): string {
  const supabase = getSupabaseClient();
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
