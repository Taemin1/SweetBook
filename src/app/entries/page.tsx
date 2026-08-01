import Link from "next/link";
import { listEntries } from "@/lib/entries";
import { EntryCard } from "@/components/EntryCard";
import { EmptyState } from "@/components/EmptyState";
import { MOODS, type Mood } from "@/lib/types";

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

      <form className="flex flex-wrap gap-2" method="GET">
        <Link
          href="/entries"
          className={`rounded-full border px-3 py-1.5 text-sm ${
            !validMood
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
              : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          }`}
        >
          전체
        </Link>
        {MOODS.map((m) => (
          <Link
            key={m.value}
            href={`/entries?mood=${m.value}`}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              validMood === m.value
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
                : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
            }`}
          >
            {m.emoji} {m.label}
          </Link>
        ))}
      </form>

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
