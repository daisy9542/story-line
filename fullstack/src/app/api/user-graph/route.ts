import { NextResponse } from "next/server";
import { clickhouseClient } from "@/http/server/clickhouse-http";

export async function GET() {
  try {
    const resultSet = await clickhouseClient.query({
      query: `
        SELECT *
        FROM user_graph_detail_score
        LIMIT 1000
      `,
      format: "JSONEachRow",
    });

    const data = await resultSet.json(); // 解析为 JS 对象数组

    return NextResponse.json({ code: 0, data });
  } catch (error: any) {
    console.error("ClickHouse 查询失败:", error.message);
    return NextResponse.json(
      { code: -1, message: "Query failed" },
      { status: 500 },
    );
  }
}
