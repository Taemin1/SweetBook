"use client";

import { useActionState, useState } from "react";
import { MOODS, type Mood } from "@/lib/types";
import type { EntryFormState } from "@/app/entries/actions";

type EntryAction = (
  prevState: EntryFormState,
  formData: FormData
) => Promise<EntryFormState>;

export function EntryForm({
  action,
  initialGratitudeItems = [],
  initialMood,
  initialNote = "",
  submitLabel,
}: {
  action: EntryAction;
  initialGratitudeItems?: string[];
  initialMood?: Mood;
  initialNote?: string | null;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<
    EntryFormState,
    FormData
  >(action, {});
  const [mood, setMood] = useState<Mood | undefined>(initialMood);

  const padded = [0, 1, 2].map((i) => initialGratitudeItems[i] ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">
          오늘 감사한 일 (최소 1개)
        </legend>
        {padded.map((value, i) => (
          <input
            key={i}
            name={`gratitude-${i}`}
            defaultValue={value}
            maxLength={80}
            placeholder={
              i === 0
                ? "예: 아침에 마신 커피가 맛있었다"
                : "선택 입력"
            }
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">오늘의 기분</legend>
        <input type="hidden" name="mood" value={mood ?? ""} />
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              aria-pressed={mood === m.value}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors ${
                mood === m.value
                  ? "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100"
                  : "border-neutral-300 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-300"
              }`}
            >
              <span aria-hidden>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">메모 (선택)</span>
        <textarea
          name="note"
          defaultValue={initialNote ?? ""}
          maxLength={300}
          rows={3}
          placeholder="더 남기고 싶은 이야기가 있다면 적어주세요."
          className="resize-none rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-amber-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </label>

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
        {isPending ? "저장하는 중..." : submitLabel}
      </button>
    </form>
  );
}
