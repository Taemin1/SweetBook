import Link from "next/link";
import { listOrders } from "@/lib/orders";
import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/EmptyState";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">책 주문</h1>
        <Link
          href="/orders/new"
          className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          책 만들기
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          emoji="📚"
          title="아직 주문한 책이 없어요"
          description="쌓인 감사일기를 한 권의 책으로 만들어보세요."
          actionHref="/orders/new"
          actionLabel="책 만들기 주문"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      <Link
        href="/admin/orders"
        className="self-center text-xs text-neutral-400 hover:underline"
      >
        운영자이신가요? 주문 관리 화면 보기
      </Link>
    </div>
  );
}
