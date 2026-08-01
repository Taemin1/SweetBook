import { NextRequest, NextResponse } from "next/server";
import { countEntriesInRange } from "@/lib/entries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const start = request.nextUrl.searchParams.get("start");
  const end = request.nextUrl.searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "start, end 쿼리 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const count = await countEntriesInRange(start, end);
  return NextResponse.json({ count });
}
