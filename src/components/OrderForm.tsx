"use client";

import { useActionState, useEffect, useState } from "react";
import { addDaysISO, formatDateRangeKorean, todayISO } from "@/lib/format";
import type { OrderFormState } from "@/app/orders/actions";
import { createOrder } from "@/app/orders/actions";

type Preset = "3m" | "6m" | "1y" | "custom";

const PRESET_LABEL: Record<Preset, string> = {
  "3m": "최근 3개월",
  "6m": "최근 6개월",
  "1y": "최근 1년",
  custom: "직접 지정",
};

function presetRange(preset: Preset): { start: string; end: string } {
  const end = todayISO();
  const months = preset === "3m" ? 3 : preset === "6m" ? 6 : 12;
  return { start: addDaysISO(end, -months * 30), end };
}

export function OrderForm() {
  const [state, formAction, isPending] = useActionState<
    OrderFormState,
    FormData
  >(createOrder, {});

  const [preset, setPreset] = useState<Preset>("3m");
  const initialRange = presetRange("3m");
  const [startDate, setStartDate] = useState(initialRange.start);
  const [endDate, setEndDate] = useState(initialRange.end);
  const [count, setCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);

  function selectPreset(p: Preset) {
    setPreset(p);
    if (p !== "custom") {
      const range = presetRange(p);
      setStartDate(range.start);
      setEndDate(range.end);
    }
  }

  const rangeValid = !!startDate && !!endDate && endDate >= startDate;

  useEffect(() => {
    if (!rangeValid) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setCountLoading(true);
      try {
        const res = await fetch(
          `/api/entries/count?start=${startDate}&end=${endDate}`
        );
        const data = await res.json();
        if (!cancelled) setCount(data.count ?? 0);
      } catch {
        if (!cancelled) setCount(null);
      } finally {
        if (!cancelled) setCountLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [rangeValid, startDate, endDate]);

  const displayCount = rangeValid ? count : null;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">책 제목</span>
        <input
          name="title"
          required
          maxLength={60}
          placeholder="예: 2026년, 감사했던 순간들"
          className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">담을 기간</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PRESET_LABEL) as Preset[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => selectPreset(p)}
              className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
                preset === p
                  ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100"
                  : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
              }`}
            >
              {PRESET_LABEL[p]}
            </button>
          ))}
        </div>

        {preset === "custom" && (
          <div className="mt-1 flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
            <span className="text-sm text-neutral-400">~</span>
            <input
              type="date"
              value={endDate}
              min={startDate}
              max={todayISO()}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
          </div>
        )}

        <input type="hidden" name="start_date" value={startDate} />
        <input type="hidden" name="end_date" value={endDate} />

        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {formatDateRangeKorean(startDate, endDate)}
        </p>
      </fieldset>

      <div className="rounded-xl bg-neutral-100 px-4 py-3 text-sm dark:bg-neutral-900">
        {!rangeValid ? (
          <span className="text-neutral-500 dark:text-neutral-400">
            종료일이 시작일보다 빠를 수 없어요.
          </span>
        ) : countLoading ? (
          <span className="text-neutral-500 dark:text-neutral-400">
            포함될 일기 수 확인 중...
          </span>
        ) : displayCount === null ? (
          <span className="text-neutral-500 dark:text-neutral-400">
            기간을 선택하면 포함될 일기 수를 보여드려요.
          </span>
        ) : (
          <span>
            이 기간에 쓴 감사일기{" "}
            <strong className="font-semibold">{displayCount}개</strong>가
            책에 담겨요.
          </span>
        )}
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "주문하는 중..." : "책 만들기 주문"}
      </button>
    </form>
  );
}
