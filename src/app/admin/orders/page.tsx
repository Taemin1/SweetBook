import { listOrders } from "@/lib/orders";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";
import { EmptyState } from "@/components/EmptyState";
import { formatDateRangeKorean, formatDateTimeKorean } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">주문 관리</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            운영자용 화면. 관리 칸의 드롭다운으로 상태를 바꿔 흐름을 관리해요.
          </p>
        </div>
        <a
          href="/api/orders/export"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          CSV 내보내기
        </a>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          emoji="🗂️"
          title="아직 주문이 없어요"
          description="사용자가 책 주문을 하면 여기에 표시돼요."
        />
      ) : (
        <div className="scrollbar-hover overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="min-w-[180px] px-4 py-3 font-medium">제목</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">기간</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">일기 수</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">주문일</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">상태</th>
                <th className="px-4 py-3 font-medium whitespace-nowrap">관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-neutral-200 dark:border-neutral-800"
                >
                  <td className="px-4 py-3">{order.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                    {formatDateRangeKorean(order.start_date, order.end_date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.entry_count}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                    {formatDateTimeKorean(order.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
