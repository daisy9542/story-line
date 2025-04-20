import { KolGraphRow } from "@/types/graph";
import { fail, ok } from "@/lib/api/response";
import { queryClickhouse } from "@/lib/clickhouse/query";

export async function GET() {
  try {
    const rawData = await queryClickhouse(`
      SELECT *
      FROM user_graph_detail_score
      LIMIT 150
    `);
    const data: KolGraphRow[] = rawData.map((row: any) => ({
      ...row,
      followers: Number(row.followers),
      label_followers: Number(row.label_followers),
      score: Number(row.score),
      created: Number(row.created),
      like_count: Number(row.like_count),
      quote_count: Number(row.quote_count),
      retweet_count: Number(row.retweet_count),
      reply_count: Number(row.reply_count),
      view_count: row.view_count !== null ? Number(row.view_count) : null,
      bookmarked_count: Number(row.bookmarked_count),
    }));

    return ok(data);
  } catch (error: any) {
    console.error("查询失败:", error.message);
    return fail("Query failed");
  }
}
