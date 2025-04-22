import { NextRequest } from "next/server";

import { KolTweet, TweetParams } from "@/types/graph";
import { fail, ok } from "@/lib/api/response";
import { queryClickhouse } from "@/lib/clickhouse/query";

function buildTweetSQL(params: TweetParams, getCount = false) {
  const {
    author_id, // 必填：主用户 A
    label_id, // 可选：用户 B，与 A 的交互；为空时按 token 查询 A 自身数据
    token, // 必填：当 label_id 为空时，按 token 筛选
    ttl, // 必填：时间窗口天数
    page_size, // 必填：每页条数
    page_num, // 必填：页码，从 1 开始
    filter_time, // 必填：参考时间戳 ms
  } = params;

  // 计算窗口起始和分页偏移
  const startTime = filter_time - ttl * 86400000;
  const offset = (page_num - 1) * page_size;

  // 根据是否传入 label_id，决定筛选条件
  const filterClause =
    label_id != null
      ? // A 与 B 的双向交互（object_type='user'）
        `(
         (author_id = ${author_id} AND label_user_id = ${label_id})
       OR (author_id = ${label_id}  AND label_user_id = ${author_id})
       )
       AND object_type = 'user'`
      : // 仅 A 对 token 的所有操作
        `author_id = ${author_id}
       AND label = '${token.replace(/'/g, "''")}'`;
      //  AND object_type != 'user'`; // 排除 user-object 情形，可按需调整

  if (getCount) {
    return `
    SELECT
      COUNT(*) AS total
    FROM user_graph_detail_score
    WHERE
      created <= ${filter_time}
      AND ${filterClause};
      `;
  }

  return `
SELECT
  tweet_id,
  active_type,
  created,
  text,
  like_count,
  quote_count,
  retweet_count,
  reply_count,
  view_count,
  bookmarked_count
FROM user_graph_detail_score
WHERE
  created <= ${filter_time}
  AND ${filterClause}
ORDER BY created DESC
LIMIT ${page_size}
OFFSET ${offset};
`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    author_id,
    label_id = null,
    token,
    ttl = 30,
    page_size,
    page_num,
    filter_time,
  } = body;
  const tweetSQL = buildTweetSQL({
    author_id,
    label_id,
    token,
    ttl,
    page_size,
    page_num,
    filter_time,
  });
  const countSQL = buildTweetSQL(
    {
      author_id,
      label_id,
      token,
      ttl,
      page_size,
      page_num,
      filter_time,
    },
    true,
  );
  try {
    const rawData = await queryClickhouse(tweetSQL);
    const queryResult = await queryClickhouse(countSQL);
    const totalPage =
      queryResult.length > 0
        ? Math.ceil(Number(queryResult[0].total) / page_size)
        : 0;
    const tweets: KolTweet[] = rawData.map((row: KolTweet) => ({
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
    return ok({
      totalPage,
      tweets,
    });
  } catch (error: any) {
    console.error("查询失败:", error.message);
    return fail("Query failed");
  }
}
