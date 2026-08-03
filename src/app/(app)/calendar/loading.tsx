export default function Loading() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-6 w-24 animate-pulse rounded bg-neutral-100 dark:bg-neutral-900" />
      <div className="grid grid-cols-7 gap-1" aria-busy="true" aria-label="불러오는 중">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900"
          />
        ))}
      </div>
    </div>
  );
}
