import { getSupabaseClient } from "./supabase";

const PHOTO_BUCKET = "entry-photos";
const PHOTO_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const PHOTO_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const AUDIO_BUCKET = "entry-audio";
const AUDIO_MAX_SIZE = 20 * 1024 * 1024; // 20MB
const AUDIO_ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/ogg",
];

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return file.type.split("/")[1] ?? "bin";
}

/** 업로드 전 검증. 문제가 있으면 사용자에게 보여줄 메시지를, 없으면 null을 반환. */
export function validatePhotoFile(file: File): string | null {
  if (!PHOTO_ALLOWED_TYPES.includes(file.type)) {
    return "사진은 JPG, PNG, WEBP, GIF 형식만 올릴 수 있어요.";
  }
  if (file.size > PHOTO_MAX_SIZE) {
    return "사진은 5MB 이하만 올릴 수 있어요.";
  }
  return null;
}

export async function uploadEntryPhoto(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const path = `${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);
  return path;
}

export async function deleteEntryPhoto(path: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.storage.from(PHOTO_BUCKET).remove([path]);
}

export function getEntryPhotoUrl(path: string): string {
  const supabase = getSupabaseClient();
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** 업로드 전 검증. 문제가 있으면 사용자에게 보여줄 메시지를, 없으면 null을 반환. */
export function validateAudioFile(file: File): string | null {
  if (!AUDIO_ALLOWED_TYPES.includes(file.type)) {
    return "음원은 MP3, M4A, WAV, OGG 형식만 올릴 수 있어요.";
  }
  if (file.size > AUDIO_MAX_SIZE) {
    return "음원은 20MB 이하만 올릴 수 있어요.";
  }
  return null;
}

export async function uploadEntryAudio(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const path = `${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);
  return path;
}

export async function deleteEntryAudio(path: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.storage.from(AUDIO_BUCKET).remove([path]);
}

export function getEntryAudioUrl(path: string): string {
  const supabase = getSupabaseClient();
  return supabase.storage.from(AUDIO_BUCKET).getPublicUrl(path).data.publicUrl;
}
