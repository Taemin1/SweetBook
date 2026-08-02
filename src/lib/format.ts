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

// ---- 월 단위 캘린더용 ----

const YEAR_MONTH_RE = /^\d{4}-\d{2}$/;

export function isYearMonth(value: string): boolean {
  return YEAR_MONTH_RE.test(value);
}

export function currentYearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function addMonths(yearMonth: string, delta: number): string {
  const [y, m] = yearMonth.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function monthLabel(yearMonth: string): string {
  const [y, m] = yearMonth.split("-").map(Number);
  return `${y}년 ${m}월`;
}

export function monthRange(yearMonth: string): { start: string; end: string } {
  const [y, m] = yearMonth.split("-").map(Number);
  return {
    start: `${yearMonth}-01`,
    end: toISODate(new Date(y, m, 0)),
  };
}

export interface CalendarCell {
  date: string;
  inMonth: boolean;
}

/** 일요일 시작 6주(최대) 그리드. 앞뒤로 다른 달의 날짜도 채워서 7의 배수로 맞춘다. */
export function calendarGridCells(yearMonth: string): CalendarCell[] {
  const [y, m] = yearMonth.split("-").map(Number);
  const firstOfMonth = new Date(y, m - 1, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(y, m, 0).getDate();

  const cells: CalendarCell[] = [];
  const firstIso = toISODate(firstOfMonth);
  for (let i = startWeekday; i > 0; i--) {
    cells.push({ date: addDaysISO(firstIso, -i), inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: toISODate(new Date(y, m - 1, day)), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: addDaysISO(cells[cells.length - 1].date, 1), inMonth: false });
  }
  return cells;
}
