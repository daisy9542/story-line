import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { CandleDataRaw, CandleData } from "@/types/candle";

export async function GET(req: NextRequest) {
  try {
    // 读取本地 jsonl 文件
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "btc_kline_1d.jsonl",
    );
    const rawText = await fs.readFile(filePath, "utf-8");
    const lines = rawText
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as CandleDataRaw);

    // 解析查询参数
    const { searchParams } = new URL(req.url);
    const after = searchParams.get("after")
      ? parseInt(searchParams.get("after")!)
      : null;
    const before = searchParams.get("before")
      ? parseInt(searchParams.get("before")!)
      : null;
    // const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 300);

    // 时间筛选逻辑
    let filtered = lines;

    if (after) {
      filtered = filtered.filter((item) => item.timestamp < after);
    }
    if (before) {
      filtered = filtered.filter((item) => item.timestamp > before);
    }

    // 排序后截断
    filtered = filtered.sort((a, b) => b.timestamp - a.timestamp);
    // .slice(0, limit);
    const res = filtered.map(
      (item) =>
        ({
          id: item.id,
          time: item.timestamp / 1000,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }) as CandleData,
    );

    return NextResponse.json({ code: 0, data: res });
  } catch (error) {
    console.error("[API_KLINE_ERROR]", error);
    return NextResponse.json(
      { code: 1, message: "读取 K 线数据失败" },
      { status: 500 },
    );
  }
}
