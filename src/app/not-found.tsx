import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <span className="text-4xl" aria-hidden>
        🔍
      </span>
      <p className="text-base font-medium">페이지를 찾을 수 없어요</p>
      <p className="max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
        주소가 잘못되었거나 삭제된 항목일 수 있어요.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
