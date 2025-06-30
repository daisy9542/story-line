import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { executeQuery } from "@/lib/db";
import { INewsEvent, ICausalInference, IEventTimelineItem, ICitation } from "@/types/report";

/**
 * 根据 sentiment_score 生成标签
 */
function sentimentLabel(score: number): "Positive" | "Negative" | "Neutral" {
  if (score > 0) return "Positive";
  if (score < 0) return "Negative";
  return "Neutral";
}

/**
 * 根据事件属性生成SVG图标
 */
function generateEventIcon(event: any): string {
  const sentiment = sentimentLabel(event.overall_sentiment_score);
  
  // 使用SVG数据URL，根据情绪返回不同颜色的圆点
  if (sentiment === "Positive") {
    // 绿色圆点
    return "data:image/svg+xml;base64," + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#22C55E"/>
      </svg>
    `);
  } else if (sentiment === "Negative") {
    // 红色圆点
    return "data:image/svg+xml;base64," + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#EF4444"/>
      </svg>
    `);
  } else {
    // 蓝色圆点（中性）
    return "data:image/svg+xml;base64," + btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#3B82F6"/>
      </svg>
    `);
  }
}



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from") ? parseInt(searchParams.get("from")!) : 0;
    const to = searchParams.get("to") ? parseInt(searchParams.get("to")!) : 0;
    const symbol = searchParams.get("symbol") || "BTC";

    // 构建SQL查询
    let query = `
      SELECT * FROM btc_kline_deep_analysis
      WHERE token = ?
    `;

    const values: any[] = [symbol];

    // 如果提供了时间范围，添加时间过滤条件
    if (from > 0 && to > 0) {
      query += ` AND (
        (STR_TO_DATE(analysis_date, '%Y-%m-%d') BETWEEN FROM_UNIXTIME(?) AND FROM_UNIXTIME(?))
        OR
        (STR_TO_DATE(start_date, '%Y-%m-%d') BETWEEN FROM_UNIXTIME(?) AND FROM_UNIXTIME(?))
      )`;
      values.push(String(from), String(to), String(from), String(to));
    }

    // 执行查询
    const results = (await executeQuery({
      query,
      values,
    })) as INewsEvent[];

    // 处理结果
    const events = results.map((dbEvent) => {
      // 处理市场指标
      if (dbEvent.historical_comparisons) {
        dbEvent.historical_comparisons = dbEvent.historical_comparisons.map((comparison) => {
          // 从market_data中提取市场指标
          const marketIndicator: Record<string, string> = {};
          if (dbEvent.market_data?.indicators) {
            Object.entries(dbEvent.market_data.indicators).forEach(([key, data]) => {
              marketIndicator[key] = data.daily_change_pct;
            });
          }

          return {
            ...comparison,
            market_indicator: marketIndicator,
          };
        });
      }

      // 转换时间戳 - 使用start_date作为事件时间，确保使用UTC时间
      const timestamp = dbEvent.start_date;

      return {
        ...dbEvent,
        event_timestamp: timestamp,
        sentiment_label: sentimentLabel(dbEvent.overall_sentiment_score),
        event_influence: Math.abs(dbEvent.overall_sentiment_score * 100) || 50,
        // 使用生成的SVG图标覆盖数据库中的icon字段
        icon: generateEventIcon(dbEvent),
      };
    });

    // 生成ETag
    const dataHash = crypto.createHash("md5").update(JSON.stringify(events)).digest("hex");

    const etag = `"${dataHash}"`;

    // 检查客户端ETag
    const clientETag = req.headers.get("if-none-match");
    if (clientETag === etag) {
      return new NextResponse(null, { status: 304 });
    }

    const response = NextResponse.json({ code: 0, data: events });

    // 设置缓存头
    response.headers.set("Cache-Control", "public, max-age=300");
    response.headers.set("ETag", etag);

    return response;
  } catch (error) {
    console.error("[API_EVENTS_ERROR]", error);
    return NextResponse.json({ code: 1, message: "读取事件数据失败" }, { status: 500 });
  }
}
