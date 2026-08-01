import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABEL,
  type OrderStatus,
} from "@/lib/types";

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <ol className="flex items-center">
      {ORDER_STATUS_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <li key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? "bg-amber-500 text-white"
                    : "bg-neutral-200 text-neutral-400 dark:bg-neutral-800"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs whitespace-nowrap ${
                  done
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-400"
                }`}
              >
                {ORDER_STATUS_LABEL[step]}
              </span>
            </div>
            {i < ORDER_STATUS_FLOW.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  i < currentIndex
                    ? "bg-amber-500"
                    : "bg-neutral-200 dark:bg-neutral-800"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
