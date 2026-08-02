export type Mood = "joy" | "calm" | "proud" | "thankful" | "excited";

export const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: "thankful", label: "감사함", emoji: "🙏" },
  { value: "joy", label: "기쁨", emoji: "😊" },
  { value: "calm", label: "평온", emoji: "🍃" },
  { value: "proud", label: "뿌듯함", emoji: "💪" },
  { value: "excited", label: "설렘", emoji: "✨" },
];

export function moodMeta(mood: Mood) {
  return MOODS.find((m) => m.value === mood) ?? MOODS[0];
}

export interface Entry {
  id: string;
  entry_date: string; // YYYY-MM-DD
  gratitude_items: string[];
  mood: Mood;
  note: string | null;
  photo_path: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "pending" | "processing" | "completed";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "processing",
  "completed",
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "제작 대기중",
  processing: "책 만드는 중",
  completed: "제작 완료",
};

export const ORDER_STATUS_DESCRIPTION: Record<OrderStatus, string> = {
  pending: "주문이 접수되었어요. 곧 제작을 시작할 예정이에요.",
  processing: "감사일기를 책으로 엮는 중이에요.",
  completed: "책이 완성되었어요.",
};

export interface Order {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  entry_count: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}
