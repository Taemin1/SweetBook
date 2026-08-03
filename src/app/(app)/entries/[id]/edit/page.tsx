import { notFound } from "next/navigation";
import { getEntry } from "@/lib/entries";
import { formatDateKorean } from "@/lib/format";
import { getEntryAudioUrl, getEntryPhotoUrl } from "@/lib/storage";
import { EntryForm } from "@/components/EntryForm";
import { updateEntry } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">감정일기 수정</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {formatDateKorean(entry.entry_date)}
        </p>
      </div>
      <EntryForm
        action={updateEntry.bind(null, id)}
        initialGratitudeItems={entry.gratitude_items}
        initialMood={entry.mood}
        initialNote={entry.note}
        initialPhotoUrl={entry.photo_path ? getEntryPhotoUrl(entry.photo_path) : null}
        initialAudioUrl={entry.audio_path ? getEntryAudioUrl(entry.audio_path) : null}
        submitLabel="수정 완료"
      />
    </div>
  );
}
