import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/orders";
import { formatDateRangeKorean, formatDateTimeKorean } from "@/lib/format";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import { ORDER_STATUS_DESCRIPTION } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">{order.title}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          주문일 {formatDateTimeKorean(order.created_at)}
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
        <OrderStatusTimeline status={order.status} />
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
          {ORDER_STATUS_DESCRIPTION[order.status]}
        </p>
      </div>

      <dl className="flex flex-col gap-3 rounded-2xl bg-neutral-100 p-5 text-sm dark:bg-neutral-900">
        <div className="flex justify-between">
          <dt className="text-neutral-500 dark:text-neutral-400">담은 기간</dt>
          <dd>{formatDateRangeKorean(order.start_date, order.end_date)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-500 dark:text-neutral-400">포함된 일기</dt>
          <dd>{order.entry_count}개</dd>
        </div>
      </dl>

      <Link
        href="/orders"
        className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
      >
        ← 주문 목록으로
      </Link>
    </div>
  );
}
