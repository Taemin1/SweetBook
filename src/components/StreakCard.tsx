export function StreakCard({
  streak,
  todayWritten,
}: {
  streak: number;
  todayWritten: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 px-6 py-5 text-white shadow-sm">
      <div>
        <p className="text-sm text-amber-50">연속 기록</p>
        <p className="text-3xl font-bold">
          {streak > 0 ? `${streak}일째` : "오늘부터 시작"}
        </p>
      </div>
      <div className="text-right text-sm text-amber-50">
        {todayWritten ? (
          <p>오늘 기록 완료 ✓</p>
        ) : streak > 0 ? (
          <p>
            오늘도 기록하면
            <br />
            {streak + 1}일째예요
          </p>
        ) : (
          <p>
            첫 감사한 일을
            <br />
            남겨보세요
          </p>
        )}
      </div>
    </div>
  );
}
