import Link from "next/link";
import { getEntryByDate, getRecentEntryDates, listEntries } from "@/lib/entries";
import { computeStreak } from "@/lib/streak";
import { todayISO } from "@/lib/format";
import { StreakCard } from "@/components/StreakCard";
import { EntryCard } from "@/components/EntryCard";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const today = todayISO();
  const [todayEntry, recentDates, recentEntries] = await Promise.all([
    getEntryByDate(today),
    getRecentEntryDates(),
    listEntries({ limit: 3 }),
  ]);
  const streak = computeStreak(recentDates, today);

  return (
    <div className="flex flex-col gap-6">
      <StreakCard streak={streak} todayWritten={!!todayEntry} />

      <Link
        href={todayEntry ? `/entries/${todayEntry.id}` : "/entries/new"}
        className="flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        {todayEntry ? "오늘 기록 다시 보기" : "오늘 기록하기"}
      </Link>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            최근 감정일기
          </h2>
          {recentEntries.length > 0 && (
            <Link
              href="/entries"
              className="text-sm text-amber-600 hover:underline dark:text-amber-400"
            >
              전체 보기
            </Link>
          )}
        </div>

        {recentEntries.length === 0 ? (
          <EmptyState
            emoji="📖"
            title="아직 감정일기가 없어요"
            description="오늘 있었던 일을 짧게 적어보세요. 매일 쌓이면 나중에 책으로 만들 수 있어요."
            actionHref="/entries/new"
            actionLabel="첫 감정일기 쓰기"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {recentEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
