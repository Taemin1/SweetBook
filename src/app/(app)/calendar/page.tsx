import Link from "next/link";
import { listEntriesInRange } from "@/lib/entries";
import { CalendarGrid } from "@/components/CalendarGrid";
import {
  addMonths,
  calendarGridCells,
  currentYearMonth,
  isYearMonth,
  monthLabel,
  monthRange,
  todayISO,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const yearMonth = month && isYearMonth(month) ? month : currentYearMonth();
  const { start, end } = monthRange(yearMonth);

  const entries = await listEntriesInRange(start, end);
  const entryByDate = new Map(entries.map((e) => [e.entry_date, e]));
  const cells = calendarGridCells(yearMonth);
  const today = todayISO();
  const isViewingCurrentMonth = yearMonth === currentYearMonth();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">캘린더</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          날짜를 누르면 그날의 감사일기를 볼 수 있어요.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href={`/calendar?month=${addMonths(yearMonth, -1)}`}
          aria-label="이전 달"
          className="rounded-full px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
        >
          ← 이전
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{monthLabel(yearMonth)}</span>
          {!isViewingCurrentMonth && (
            <Link
              href="/calendar"
              className="text-xs text-amber-600 hover:underline dark:text-amber-400"
            >
              이번 달로
            </Link>
          )}
        </div>
        <Link
          href={`/calendar?month=${addMonths(yearMonth, 1)}`}
          aria-label="다음 달"
          className="rounded-full px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
        >
          다음 →
        </Link>
      </div>

      <CalendarGrid cells={cells} entryByDate={entryByDate} today={today} />

      {entries.length === 0 && (
        <p className="text-center text-sm text-neutral-400">
          {monthLabel(yearMonth)}에는 기록이 없어요.
        </p>
      )}
    </div>
  );
}
