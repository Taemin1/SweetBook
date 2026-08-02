import Image from "next/image";
import Link from "next/link";
import { MoodBadge } from "./MoodBadge";
import { formatDateKorean } from "@/lib/format";
import { getEntryPhotoUrl } from "@/lib/storage";
import type { Entry } from "@/lib/types";

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <Link
      href={`/entries/${entry.id}`}
      className="flex gap-3 rounded-2xl border border-neutral-200 px-5 py-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50 dark:border-neutral-800 dark:hover:border-amber-800 dark:hover:bg-amber-900/10"
    >
      {entry.photo_path && (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={getEntryPhotoUrl(entry.photo_path)}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
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
      </div>
    </Link>
  );
}
