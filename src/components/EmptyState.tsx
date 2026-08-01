import Link from "next/link";

export function EmptyState({
  emoji,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  emoji: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-neutral-700">
      <span className="text-4xl" aria-hidden>
        {emoji}
      </span>
      <p className="text-base font-medium">{title}</p>
      <p className="max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
        {description}
      </p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
