import Link from "next/link";
import { moodMeta, type Entry } from "@/lib/types";
import type { CalendarCell } from "@/lib/format";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function DayCellContent({
  dayNum,
  inMonth,
  isToday,
  entry,
}: {
  dayNum: number;
  inMonth: boolean;
  isToday: boolean;
  entry?: Entry;
}) {
  const meta = entry ? moodMeta(entry.mood) : null;
  const isPositive = meta?.valence === "positive";
  const cellTint = !inMonth
    ? ""
    : isPositive
      ? "bg-amber-50 dark:bg-amber-900/20"
      : meta
        ? "bg-slate-100 dark:bg-slate-800/40"
        : "bg-neutral-50 dark:bg-neutral-900/40";
  const badgeTint = isPositive
    ? "bg-amber-200/70 text-amber-900 dark:bg-amber-800/60 dark:text-amber-100"
    : "bg-slate-300/60 text-slate-800 dark:bg-slate-700/70 dark:text-slate-100";

  return (
    <div
      className={`flex aspect-square flex-col gap-0.5 overflow-hidden rounded-lg p-1 text-left transition-colors ${cellTint} ${
        isToday ? "ring-2 ring-amber-500" : ""
      } ${!inMonth ? "opacity-30" : ""}`}
    >
      <span className="text-[10px] text-neutral-400 sm:text-xs">{dayNum}</span>
      {entry && meta && (
        <>
          <span
            className={`inline-flex w-fit max-w-full items-center gap-0.5 rounded-full px-1 py-0.5 text-[7px] leading-none font-medium sm:text-[9px] ${badgeTint}`}
          >
            <span aria-hidden>{meta.emoji}</span>
            <span className="truncate">{meta.label}</span>
          </span>
          <span className="truncate text-[9px] leading-tight text-neutral-600 sm:text-[11px] dark:text-neutral-300">
            {entry.gratitude_items[0]}
          </span>
        </>
      )}
      {!entry && isToday && inMonth && (
        <span className="text-[9px] text-amber-500 sm:text-[11px]">+ 오늘 기록</span>
      )}
    </div>
  );
}

export function CalendarGrid({
  cells,
  entryByDate,
  today,
}: {
  cells: CalendarCell[];
  entryByDate: Map<string, Entry>;
  today: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-neutral-400 sm:text-xs">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const entry = entryByDate.get(cell.date);
          const isToday = cell.date === today;
          const dayNum = Number(cell.date.slice(8, 10));

          if (cell.inMonth && entry) {
            return (
              <Link key={cell.date} href={`/entries/${entry.id}`}>
                <DayCellContent
                  dayNum={dayNum}
                  inMonth={cell.inMonth}
                  isToday={isToday}
                  entry={entry}
                />
              </Link>
            );
          }

          if (cell.inMonth && isToday) {
            return (
              <Link key={cell.date} href="/entries/new">
                <DayCellContent dayNum={dayNum} inMonth={cell.inMonth} isToday={isToday} />
              </Link>
            );
          }

          return (
            <div key={cell.date}>
              <DayCellContent dayNum={dayNum} inMonth={cell.inMonth} isToday={isToday} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
