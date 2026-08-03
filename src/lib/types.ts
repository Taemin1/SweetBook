export type Mood =
  | "thankful"
  | "joy"
  | "calm"
  | "proud"
  | "excited"
  | "happy"
  | "relieved"
  | "loving"
  | "sad"
  | "angry"
  | "anxious"
  | "tired"
  | "down"
  | "lonely"
  | "frustrated"
  | "regretful";

export type MoodValence = "positive" | "negative";

interface MoodMeta {
  value: Mood;
  label: string;
  emoji: string;
  valence: MoodValence;
}

export const MOODS: MoodMeta[] = [
  // 긍정
  { value: "thankful", label: "감사함", emoji: "🙏", valence: "positive" },
  { value: "joy", label: "기쁨", emoji: "😊", valence: "positive" },
  { value: "calm", label: "평온", emoji: "🍃", valence: "positive" },
  { value: "proud", label: "뿌듯함", emoji: "💪", valence: "positive" },
  { value: "excited", label: "설렘", emoji: "✨", valence: "positive" },
  { value: "happy", label: "행복", emoji: "😄", valence: "positive" },
  { value: "relieved", label: "편안함", emoji: "😌", valence: "positive" },
  { value: "loving", label: "사랑스러움", emoji: "🥰", valence: "positive" },
  // 부정
  { value: "sad", label: "슬픔", emoji: "😢", valence: "negative" },
  { value: "angry", label: "화남", emoji: "😠", valence: "negative" },
  { value: "anxious", label: "불안", emoji: "😰", valence: "negative" },
  { value: "tired", label: "지침", emoji: "😩", valence: "negative" },
  { value: "down", label: "우울함", emoji: "😔", valence: "negative" },
  { value: "lonely", label: "외로움", emoji: "🥺", valence: "negative" },
  { value: "frustrated", label: "답답함", emoji: "😤", valence: "negative" },
  { value: "regretful", label: "후회", emoji: "😞", valence: "negative" },
];

export const POSITIVE_MOODS = MOODS.filter((m) => m.valence === "positive");
export const NEGATIVE_MOODS = MOODS.filter((m) => m.valence === "negative");

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
  processing: "감정일기를 책으로 엮는 중이에요.",
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
