import { NextRequest } from "next/server";

import { KOL } from "@/types/kol";
import { fail, ok } from "@/lib/api/response";
import { queryClickhouse } from "@/lib/clickhouse/query";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return fail("Missing userId", 400);
  }
  try {
    const data: KOL[] = await queryClickhouse(
      `
      SELECT *
      FROM user_info
      WHERE id = {id:Int64}
      LIMIT 1
    `,
      { id },
    );
    console.log(data);
    return ok(data[0]);
  } catch (error: any) {
    console.error("查询失败:", error.message);
    return fail("Query failed");
  }
}
