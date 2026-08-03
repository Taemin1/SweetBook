"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase";
import { countEntriesInRange } from "@/lib/entries";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_FLOW } from "@/lib/types";

export interface OrderFormState {
  error?: string;
}

export async function createOrder(
  _prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const title = (formData.get("title") as string | null)?.trim();
  const startDate = formData.get("start_date") as string | null;
  const endDate = formData.get("end_date") as string | null;

  if (!title) {
    return { error: "책 제목을 입력해주세요." };
  }
  if (!startDate || !endDate) {
    return { error: "책에 담을 기간을 선택해주세요." };
  }
  if (endDate < startDate) {
    return { error: "종료일이 시작일보다 빠를 수 없어요." };
  }

  const entryCount = await countEntriesInRange(startDate, endDate);
  if (entryCount === 0) {
    return { error: "선택한 기간에 작성된 감사일기가 없어요. 다른 기간을 선택해주세요." };
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      title,
      start_date: startDate,
      end_date: endDate,
      entry_count: entryCount,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    return { error: "주문 생성에 실패했어요. 잠시 후 다시 시도해주세요." };
  }

  revalidatePath("/orders");
  redirect(`/orders/${data.id}`);
}

export async function advanceOrderStatus(id: string, current: OrderStatus) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(current);
  const next = ORDER_STATUS_FLOW[currentIndex + 1];
  if (!next) return;

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: next })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  revalidatePath("/admin/orders");
}
