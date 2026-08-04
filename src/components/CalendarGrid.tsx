"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { moodMeta, type Entry } from "@/lib/types";
import type { CalendarCell } from "@/lib/format";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

type ViewMode = "mood" | "photo" | "audio";

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "mood", label: "감정" },
  { value: "photo", label: "사진" },
  { value: "audio", label: "음악" },
];

function DayCellContent({
  dayNum,
  inMonth,
  isToday,
  entry,
  view,
  photoUrl,
}: {
  dayNum: number;
  inMonth: boolean;
  isToday: boolean;
  entry?: Entry;
  view: ViewMode;
  photoUrl?: string;
}) {
  if (view === "photo") {
    const hasPhoto = !!photoUrl;
    return (
      <div
        className={`relative flex aspect-square flex-col overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-900/40 ${
          isToday ? "ring-2 ring-amber-500" : ""
        } ${!inMonth ? "opacity-30" : ""}`}
      >
        {photoUrl && (
          <Image src={photoUrl} alt="" fill sizes="80px" className="object-cover" />
        )}
        <span
          className={`relative z-10 p-1 text-[10px] sm:text-xs ${
            hasPhoto
              ? "text-white drop-shadow [text-shadow:0_1px_2px_rgb(0_0_0_/_60%)]"
              : "text-neutral-400"
          }`}
        >
          {dayNum}
        </span>
      </div>
    );
  }

  if (view === "audio") {
    const hasAudio = !!entry?.audio_path;
    return (
      <div
        className={`flex aspect-square flex-col gap-0.5 overflow-hidden rounded-lg p-1 text-left ${
          hasAudio ? "bg-indigo-50 dark:bg-indigo-900/20" : "bg-neutral-50 dark:bg-neutral-900/40"
        } ${isToday ? "ring-2 ring-amber-500" : ""} ${!inMonth ? "opacity-30" : ""}`}
      >
        <span className="text-[10px] text-neutral-400 sm:text-xs">{dayNum}</span>
        {hasAudio && (
          <>
            <span className="text-xs sm:text-sm" aria-hidden>
              🎵
            </span>
            <span className="line-clamp-2 break-keep text-[9px] leading-tight text-neutral-600 sm:text-[11px] dark:text-neutral-300">
              {entry!.audio_filename ?? "음원"}
            </span>
          </>
        )}
      </div>
    );
  }

  // view === "mood" (기본)
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
          <span className="line-clamp-2 break-keep text-[9px] leading-tight text-neutral-600 sm:text-[11px] dark:text-neutral-300">
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
  entries,
  today,
  photoUrls,
}: {
  cells: CalendarCell[];
  entries: Entry[];
  today: string;
  photoUrls: Record<string, string>;
}) {
  const [view, setView] = useState<ViewMode>("mood");
  const entryByDate = useMemo(
    () => new Map(entries.map((e) => [e.entry_date, e])),
    [entries]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <label className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          보기
          <select
            value={view}
            onChange={(e) => setView(e.target.value as ViewMode)}
            className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-700 outline-none focus:border-amber-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          >
            {VIEW_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

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
                  view={view}
                  photoUrl={photoUrls[entry.id]}
                />
              </Link>
            );
          }

          if (cell.inMonth && isToday && view === "mood") {
            return (
              <Link key={cell.date} href="/entries/new">
                <DayCellContent
                  dayNum={dayNum}
                  inMonth={cell.inMonth}
                  isToday={isToday}
                  view={view}
                />
              </Link>
            );
          }

          return (
            <div key={cell.date}>
              <DayCellContent
                dayNum={dayNum}
                inMonth={cell.inMonth}
                isToday={isToday}
                view={view}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
