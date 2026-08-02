import { moodMeta, type Mood } from "@/lib/types";

export function MoodBadge({ mood }: { mood: Mood }) {
  const meta = moodMeta(mood);
  const styles =
    meta.valence === "positive"
      ? "bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}
    >
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
