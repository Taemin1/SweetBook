"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <span className="text-4xl" aria-hidden>
        ⚠️
      </span>
      <p className="text-base font-medium">문제가 발생했어요</p>
      <p className="max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
        {error.message || "잠시 후 다시 시도해주세요."}
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600"
      >
        다시 시도
      </button>
    </div>
  );
}
