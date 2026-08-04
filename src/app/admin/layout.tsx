import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            하루감정 · 관리자
          </span>
          <Link
            href="/"
            className="text-sm text-amber-600 hover:underline dark:text-amber-400"
          >
            사용자 화면으로
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </>
  );
}
