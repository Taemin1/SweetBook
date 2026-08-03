import { OrderForm } from "@/components/OrderForm";

export default function NewOrderPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">감정일기 책 만들기</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          쌓아온 감정일기를 골라 한 권의 책으로 주문해보세요.
        </p>
      </div>
      <OrderForm />
    </div>
  );
}
