import { moodMeta, type Mood } from "@/lib/types";

export function MoodBadge({ mood }: { mood: Mood }) {
  const meta = moodMeta(mood);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
