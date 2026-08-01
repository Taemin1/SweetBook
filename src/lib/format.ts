function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDateParts(d: Date): string {
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${WEEKDAYS[d.getDay()]})`;
}

/** "YYYY-MM-DD" 같은 날짜 전용 문자열용. 시간대 보정 없이 그 날짜 그대로 표시. */
export function formatDateKorean(iso: string): string {
  return formatDateParts(new Date(`${iso}T00:00:00`));
}

/** Supabase의 timestamptz(UTC) 값을 서버 로컬 시간대로 변환해 날짜만 표시. */
export function formatDateTimeKorean(isoDateTime: string): string {
  return formatDateParts(new Date(isoDateTime));
}

export function formatDateRangeKorean(startIso: string, endIso: string): string {
  return `${formatDateKorean(startIso)} ~ ${formatDateKorean(endIso)}`;
}
