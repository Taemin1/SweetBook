"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase";
import { getEntry } from "@/lib/entries";
import { todayISO } from "@/lib/format";
import { deleteEntryPhoto, uploadEntryPhoto, validatePhotoFile } from "@/lib/storage";
import { MOODS, type Mood } from "@/lib/types";

export interface EntryFormState {
  error?: string;
}

function parseGratitudeItems(formData: FormData): string[] {
  return [0, 1, 2]
    .map((i) => (formData.get(`gratitude-${i}`) as string | null)?.trim() ?? "")
    .filter((v) => v.length > 0);
}

function parseMood(formData: FormData): Mood | null {
  const value = formData.get("mood") as string | null;
  return MOODS.some((m) => m.value === value) ? (value as Mood) : null;
}

function parsePhotoFile(formData: FormData): File | null {
  const value = formData.get("photo");
  return value instanceof File && value.size > 0 ? value : null;
}

export async function createEntry(
  _prevState: EntryFormState,
  formData: FormData
): Promise<EntryFormState> {
  const gratitudeItems = parseGratitudeItems(formData);
  const mood = parseMood(formData);
  const note = (formData.get("note") as string | null)?.trim() || null;
  const photoFile = parsePhotoFile(formData);

  if (gratitudeItems.length === 0) {
    return { error: "감사한 일을 최소 1개 이상 적어주세요." };
  }
  if (!mood) {
    return { error: "오늘의 기분을 선택해주세요." };
  }
  if (photoFile) {
    const photoError = validatePhotoFile(photoFile);
    if (photoError) return { error: photoError };
  }

  let photoPath: string | null = null;
  if (photoFile) {
    try {
      photoPath = await uploadEntryPhoto(photoFile);
    } catch {
      return { error: "사진 업로드에 실패했어요. 잠시 후 다시 시도해주세요." };
    }
  }

  const entryDate = todayISO();
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("entries")
    .insert({
      entry_date: entryDate,
      gratitude_items: gratitudeItems,
      mood,
      note,
      photo_path: photoPath,
    })
    .select("id")
    .single();

  if (error) {
    if (photoPath) await deleteEntryPhoto(photoPath).catch(() => {});
    if (error.code === "23505") {
      // unique 위반: 이미 오늘 일기가 있음 (동시 제출 등 경쟁 상태)
      const existing = await getExistingEntryIdForDate(entryDate);
      if (existing) redirect(`/entries/${existing}`);
    }
    return { error: "저장에 실패했어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/");
  revalidatePath("/entries");
  redirect(`/entries/${data.id}`);
}

async function getExistingEntryIdForDate(date: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("entries")
    .select("id")
    .eq("entry_date", date)
    .maybeSingle();
  return data?.id ?? null;
}

export async function updateEntry(
  id: string,
  _prevState: EntryFormState,
  formData: FormData
): Promise<EntryFormState> {
  const gratitudeItems = parseGratitudeItems(formData);
  const mood = parseMood(formData);
  const note = (formData.get("note") as string | null)?.trim() || null;
  const photoFile = parsePhotoFile(formData);
  const removePhoto = formData.get("remove_photo") === "1";

  if (gratitudeItems.length === 0) {
    return { error: "감사한 일을 최소 1개 이상 적어주세요." };
  }
  if (!mood) {
    return { error: "오늘의 기분을 선택해주세요." };
  }
  if (photoFile) {
    const photoError = validatePhotoFile(photoFile);
    if (photoError) return { error: photoError };
  }

  const existing = await getEntry(id);
  if (!existing) {
    return { error: "존재하지 않는 일기예요." };
  }

  let photoPath = existing.photo_path;
  let uploadedPath: string | null = null;
  if (photoFile) {
    try {
      uploadedPath = await uploadEntryPhoto(photoFile);
      photoPath = uploadedPath;
    } catch {
      return { error: "사진 업로드에 실패했어요. 잠시 후 다시 시도해주세요." };
    }
  } else if (removePhoto) {
    photoPath = null;
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("entries")
    .update({ gratitude_items: gratitudeItems, mood, note, photo_path: photoPath })
    .eq("id", id);

  if (error) {
    if (uploadedPath) await deleteEntryPhoto(uploadedPath).catch(() => {});
    return { error: "수정에 실패했어요. 잠시 후 다시 시도해주세요." };
  }

  // 사진을 교체했거나 제거했다면, 더 이상 쓰이지 않는 예전 사진을 정리
  if (existing.photo_path && existing.photo_path !== photoPath) {
    await deleteEntryPhoto(existing.photo_path).catch(() => {});
  }

  revalidatePath("/");
  revalidatePath("/entries");
  revalidatePath(`/entries/${id}`);
  redirect(`/entries/${id}`);
}

export async function deleteEntry(id: string): Promise<void> {
  const existing = await getEntry(id);

  const supabase = getSupabaseClient();
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.photo_path) {
    await deleteEntryPhoto(existing.photo_path).catch(() => {});
  }

  revalidatePath("/");
  revalidatePath("/entries");
  redirect("/entries");
}
