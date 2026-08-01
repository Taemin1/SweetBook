import Link from "next/link";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatDateRangeKorean } from "@/lib/format";
import type { Order } from "@/lib/types";

export function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex flex-col gap-2 rounded-2xl border border-neutral-200 px-5 py-4 transition-colors hover:border-amber-300 hover:bg-amber-50/50 dark:border-neutral-800 dark:hover:border-amber-800 dark:hover:bg-amber-900/10"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{order.title}</span>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {formatDateRangeKorean(order.start_date, order.end_date)} · 일기{" "}
        {order.entry_count}개
      </p>
    </Link>
  );
}
