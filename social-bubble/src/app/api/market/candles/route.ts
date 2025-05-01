import { NextRequest } from "next/server";
import { okxHttp } from "@/http/server";
import type { UTCTimestamp } from "lightweight-charts";

import type { CandleData, CandleRequestParams } from "@/types/candlestick";
import { fail, ok } from "@/lib/api/response";

/**
 * GET /api/candles
 *
 * 查询 OKX k 线数据并返回极简 CandleData 数组，已完成 parseFloat、时间戳换算和倒序。
 * 接受参数：
 *   - instId  （必填） 例如 "BTC-USDT"
 *   - bar     （可选） 例如 "1m", "5m", "1H", "1D"
 *   - before  （可选） 请求早于该时间戳的数据（毫秒级字符串）
 *   - after   （可选） 请求晚于该时间戳的数据（毫秒级字符串）
 *   - limit   （可选） 返回数量，默认 100，最大 300
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const instId = searchParams.get("instId");
  const bar = searchParams.get("bar") ?? "1m";
  const before = searchParams.get("before") ?? undefined;
  const after = searchParams.get("after") ?? undefined;
  const limit = searchParams.get("limit") ?? undefined;

  try {
    if (!instId) {
      return fail("Missing instId", 400);
    }

    const params: CandleRequestParams = {
      instId,
      bar,
      before,
      after,
      limit,
    };
    const okxResponse = await okxHttp.get("/v5/market/history-candles", params);
    const rawData = okxResponse.data;

    const data: CandleData[] = rawData
      .map((item: string[]) => ({
        time: Math.floor(Number(item[0]) / 1000) as UTCTimestamp,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
        volumeBase: parseFloat(item[6]),
        volumeQuote: parseFloat(item[7]),
        confirm: item[8] === "1",
      }))
      .reverse();
    return ok(data);
  } catch (error: any) {
    console.error("Fetch candles failed:", error);
    return fail("Query failed");
  }
}
