import { redirect } from "next/navigation";
import { getEntryByDate } from "@/lib/entries";
import { todayISO, formatDateKorean } from "@/lib/format";
import { EntryForm } from "@/components/EntryForm";
import { createEntry } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewEntryPage() {
  const today = todayISO();
  const existing = await getEntryByDate(today);
  if (existing) {
    redirect(`/entries/${existing.id}`);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">오늘의 감사</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {formatDateKorean(today)}
        </p>
      </div>
      <EntryForm action={createEntry} submitLabel="저장하기" />
    </div>
  );
}
