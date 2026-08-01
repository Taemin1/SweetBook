import { addDaysISO, todayISO } from "./format";

/**
 * 오늘(또는 아직 오늘 기록이 없다면 어제)부터 거꾸로 날짜가 끊기지 않고
 * 이어지는 일수를 센다. entryDates는 "YYYY-MM-DD" 문자열 배열(중복 가능, 정렬 무관).
 */
export function computeStreak(entryDates: string[], today = todayISO()): number {
  const set = new Set(entryDates);
  let cursor = set.has(today) ? today : addDaysISO(today, -1);
  let streak = 0;

  while (set.has(cursor)) {
    streak += 1;
    cursor = addDaysISO(cursor, -1);
  }

  return streak;
}
