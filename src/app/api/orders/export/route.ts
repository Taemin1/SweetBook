import { NextResponse } from "next/server";
import { listOrders } from "@/lib/orders";
import { ORDER_STATUS_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const orders = await listOrders();

  const header = [
    "제목",
    "시작일",
    "종료일",
    "일기수",
    "상태",
    "주문일시",
  ];
  const rows = orders.map((o) => [
    o.title,
    o.start_date,
    o.end_date,
    String(o.entry_count),
    ORDER_STATUS_LABEL[o.status],
    o.created_at,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  // Excel에서 한글이 깨지지 않도록 UTF-8 BOM 포함
  const bom = "﻿";

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders.csv"`,
    },
  });
}
