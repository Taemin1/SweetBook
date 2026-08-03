import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry } from "@/lib/entries";
import { formatDateKorean } from "@/lib/format";
import { getEntryAudioUrl, getEntryPhotoUrl } from "@/lib/storage";
import { MoodBadge } from "@/components/MoodBadge";
import { DeleteEntryButton } from "@/components/DeleteEntryButton";
import { AudioPlayer } from "@/components/AudioPlayer";

export const dynamic = "force-dynamic";

export default async function EntryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatDateKorean(entry.entry_date)}
          </p>
          <h1 className="text-xl font-semibold">오늘의 기록</h1>
        </div>
        <MoodBadge mood={entry.mood} />
      </div>

      {entry.photo_path && (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
          <Image
            src={getEntryPhotoUrl(entry.photo_path)}
            alt="일기에 첨부한 사진"
            fill
            sizes="(max-width: 672px) 100vw, 672px"
            className="object-cover"
          />
        </div>
      )}

      <ul className="flex flex-col gap-2 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
        {entry.gratitude_items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="text-amber-500">{i + 1}</span>
            {item}
          </li>
        ))}
      </ul>

      {entry.audio_path && <AudioPlayer src={getEntryAudioUrl(entry.audio_path)} />}

      {entry.note && (
        <p className="whitespace-pre-wrap rounded-2xl bg-neutral-100 p-5 text-sm text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
          {entry.note}
        </p>
      )}

      <div className="flex items-center justify-between">
        <Link
          href="/entries"
          className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
        >
          ← 목록으로
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/entries/${entry.id}/edit`}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            수정
          </Link>
          <DeleteEntryButton id={entry.id} />
        </div>
      </div>
    </div>
  );
}
