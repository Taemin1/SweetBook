import Link from "next/link";
import { listEntries } from "@/lib/entries";
import { EntryCard } from "@/components/EntryCard";
import { EmptyState } from "@/components/EmptyState";
import { MOODS, NEGATIVE_MOODS, POSITIVE_MOODS, type Mood } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EntriesPage({
  searchParams,
}: {
  searchParams: Promise<{ mood?: string }>;
}) {
  const { mood } = await searchParams;
  const validMood = MOODS.some((m) => m.value === mood)
    ? (mood as Mood)
    : undefined;

  const entries = await listEntries({ mood: validMood });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">감사일기</h1>
        <Link
          href="/entries/new"
          className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          오늘의 감사 쓰기
        </Link>
      </div>

      <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
        <Link
          href="/entries"
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap ${
            !validMood
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
              : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          }`}
        >
          전체
        </Link>
        {POSITIVE_MOODS.map((m) => (
          <Link
            key={m.value}
            href={`/entries?mood=${m.value}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap ${
              validMood === m.value
                ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100"
                : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
            }`}
          >
            {m.emoji} {m.label}
          </Link>
        ))}
        <span
          aria-hidden
          className="mx-0.5 w-px shrink-0 self-stretch bg-neutral-200 dark:bg-neutral-800"
        />
        {NEGATIVE_MOODS.map((m) => (
          <Link
            key={m.value}
            href={`/entries?mood=${m.value}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap ${
              validMood === m.value
                ? "border-slate-500 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
            }`}
          >
            {m.emoji} {m.label}
          </Link>
        ))}
      </div>

      {entries.length === 0 ? (
        <EmptyState
          emoji={validMood ? "🔍" : "📖"}
          title={
            validMood
              ? "이 기분으로 남긴 일기가 없어요"
              : "아직 감사일기가 없어요"
          }
          description={
            validMood
              ? "다른 기분을 선택하거나 전체 목록을 확인해보세요."
              : "오늘 있었던 감사한 일 세 가지를 짧게 적어보세요."
          }
          actionHref="/entries/new"
          actionLabel="오늘의 감사 쓰기"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
