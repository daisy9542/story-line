import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

/**
 * 生成一个随机整数，范围 [min, max]
 */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成一个随机浮点数，范围 [min, max]
 */
function randFloat(min: number, max: number, decimals = 2): number {
  const p = Math.pow(10, decimals);
  return Math.round((Math.random() * (max - min) + min) * p) / p;
}

/**
 * 根据 sentiment_score 生成标签
 */
function sentimentLabel(score: number): "Positive" | "Negative" | "Neutral" {
  if (score > 0.2) return "Positive";
  if (score < -0.2) return "Negative";
  return "Neutral";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from") ? parseInt(searchParams.get("from")!) : 0;
    const to = searchParams.get("to") ? parseInt(searchParams.get("to")!) : 100;
    // const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 300);
    const symbol = searchParams.get("symbol");

    const count = randInt(5, 15);
    const events = Array.from({ length: count }).map(() => {
      const reportId = randomUUID();
      const eventId = randomUUID();
      const timestamp = randInt(from, to);
      const score = randFloat(-1, 1, 2);

      return {
        report_id: reportId,
        // ---- 核心事件信息 ----
        event_id: eventId,
        event_title: `${symbol} 协议出现重大动态`,
        event_influence: randInt(1, 100),
        event_timestamp: timestamp,
        summary: `${symbol} 相关文章或报告在该时间段内描述了一些背景、影响及潜在后市走向。`,
        sentiment_score: score,
        sentiment_label: sentimentLabel(score),

        // ---- 事件相关要素 ----
        key_entities: [
          {
            name: symbol,
            type: "Cryptocurrency",
            entity_id: `ID-${randInt(10000, 99999)}`,
          },
        ],
        event_categories: [
          {
            category_name: "市场动态",
            category_code: "MARKET_NEWS",
          },
        ],

        // ---- 因果关系分析 ----
        causal_analysis: [
          {
            cause: "市场预期变化",
            trigger: "大型基金建仓",
            effect: {
              cause: "资金流入加速",
              trigger: "价格短期飙升",
              effect: "更多散户跟进",
            },
          },
        ],

        // ---- 历史相似事件 + 宏观和微观指数----
        historical_analogues: [
          {
            historical_case_summary: `${symbol} 早期空投`,
            historical_event_date: "2021-08-01",
            similarity_description: "社区驱动分发机制",
            related_report_id: randomUUID(),
            market_indicator: {
              crypto: `${randFloat(-5, 5)}%`,
              djia: `${randFloat(-3, 3)}%`,
              ndx: `${randFloat(-4, 4)}%`,
            },
          },
        ],
      };
    });
    return NextResponse.json({ code: 0, data: events });
  } catch (error) {
    console.error("[API_EVENTS_ERROR]", error);
    return NextResponse.json({ code: 1, message: "读取事件数据失败" }, { status: 500 });
  }
}
