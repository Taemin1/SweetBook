import { getSupabaseClient } from "./supabase";
import { isUuid } from "./id";
import { MOODS, type Entry, type Mood, type MoodValence } from "./types";

export async function listEntries(options?: {
  mood?: Mood;
  valence?: MoodValence;
  limit?: number;
}): Promise<Entry[]> {
  const supabase = getSupabaseClient();
  let query = supabase
    .from("entries")
    .select("*")
    .order("entry_date", { ascending: false });

  if (options?.mood) {
    query = query.eq("mood", options.mood);
  } else if (options?.valence) {
    const moodsInValence = MOODS.filter((m) => m.valence === options.valence).map(
      (m) => m.value
    );
    query = query.in("mood", moodsInValence);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Entry[];
}

export async function getEntry(id: string): Promise<Entry | null> {
  if (!isUuid(id)) return null;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Entry | null;
}

export async function getEntryByDate(date: string): Promise<Entry | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .eq("entry_date", date)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Entry | null;
}

export async function getRecentEntryDates(limit = 400): Promise<string[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("entries")
    .select("entry_date")
    .order("entry_date", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as { entry_date: string }[]).map((row) => row.entry_date);
}

export async function listEntriesInRange(
  startDate: string,
  endDate: string
): Promise<Entry[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("entry_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Entry[];
}

export async function countEntriesInRange(
  startDate: string,
  endDate: string
): Promise<number> {
  const supabase = getSupabaseClient();
  const { count, error } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .gte("entry_date", startDate)
    .lte("entry_date", endDate);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
