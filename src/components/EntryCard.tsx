import Link from "next/link";
import { MoodBadge } from "./MoodBadge";
import { formatDateKorean } from "@/lib/format";
import type { Entry } from "@/lib/types";

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <Link
      href={`/entries/${entry.id}`}
      className="flex flex-col gap-2 rounded-2xl border border-neutral-200 px-5 py-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50 dark:border-neutral-800 dark:hover:border-amber-800 dark:hover:bg-amber-900/10"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {formatDateKorean(entry.entry_date)}
        </span>
        <MoodBadge mood={entry.mood} />
      </div>
      <ul className="flex flex-col gap-0.5 text-sm">
        {entry.gratitude_items.map((item, i) => (
          <li key={i} className="truncate">
            · {item}
          </li>
        ))}
      </ul>
    </Link>
  );
}
