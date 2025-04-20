// app/api/user-graph/route.ts
import { NextRequest } from "next/server";

import { KolTweetRaw } from "@/types/graph";
import { fail, ok } from "@/lib/api/response";
import { queryClickhouse } from "@/lib/clickhouse/query";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const authorId = Number(searchParams.get("authorId"));
  const pageNum = Number(searchParams.get("pageNum") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "20");
  const offset = (pageNum - 1) * pageSize;

  if (!authorId) {
    return fail("Missing userId", 400);
  }
  try {
    const rawData = await queryClickhouse(
      `
      SELECT
        author_id,
        username,
        name,
        followers,
        tweet_id,
        created,
        text,
        score,
        like_count,
        quote_count,
        retweet_count,
        reply_count,
        view_count,
        bookmarked_count
      FROM user_graph_detail_score
      WHERE author_id = {authorId:UInt64}
      ORDER BY created DESC
      LIMIT {pageSize:UInt32}
      OFFSET {offset:UInt32}
    `,
      {
        authorId,
        pageSize,
        offset,
      },
    );
    const data: KolTweetRaw[] = rawData.map((row) => ({
      ...row,
      text: row.text,
      created: Number(row.created),
      like_count: Number(row.like_count),
      quote_count: Number(row.quote_count),
      retweet_count: Number(row.retweet_count),
      reply_count: Number(row.reply_count),
      view_count: row.view_count !== null ? Number(row.view_count) : 0,
      bookmarked_count: Number(row.bookmarked_count),
    }));
    return ok(data);
  } catch (error: any) {
    console.error("查询失败:", error.message);
    return fail("Query failed");
  }
}
