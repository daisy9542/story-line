import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50;

    // 查询弹幕数据，只获取event_title字段，按创建时间倒序
    const query = `
      SELECT event_title, created_at
      FROM btc_daily_hotspot 
      WHERE event_title IS NOT NULL 
        AND event_title != ''
      ORDER BY created_at DESC 
      LIMIT ?
    `;

    const results = await executeQuery({
      query,
      values: [limit],
    });

    // 提取event_title数组
    const danmakuData = results.map((row: any) => row.event_title);

    const response = NextResponse.json({ 
      code: 0, 
      data: danmakuData,
      count: danmakuData.length 
    });

    // 设置缓存头，缓存5分钟
    response.headers.set("Cache-Control", "public, max-age=300");

    return response;
  } catch (error) {
    console.error("[API_DANMAKU_ERROR]", error);
    return NextResponse.json(
      { code: 1, message: "获取弹幕数据失败" }, 
      { status: 500 }
    );
  }
}
