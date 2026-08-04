"use client";

import { useTransition } from "react";
import { setOrderStatus } from "@/app/(app)/orders/actions";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types";

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        startTransition(() => {
          setOrderStatus(orderId, next);
        });
      }}
      className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 outline-none focus:border-amber-500 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
    >
      {ORDER_STATUS_FLOW.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
