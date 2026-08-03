"use client";

import { deleteEntry } from "@/app/(app)/entries/actions";

export function DeleteEntryButton({ id }: { id: string }) {
  return (
    <form
      action={deleteEntry.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("이 감사일기를 삭제할까요? 되돌릴 수 없어요.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-300 dark:hover:bg-red-900/20"
      >
        삭제
      </button>
    </form>
  );
}
