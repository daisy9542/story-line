import { NextRequest } from "next/server";

import {
  ForceGraphParams,
  GraphLink,
  GraphLinkRaw,
  GraphNode,
} from "@/types/graph";
import { fail, ok } from "@/lib/api/response";
import { queryClickhouse } from "@/lib/clickhouse/query";

function buildGraphNodesSQL(params: ForceGraphParams) {
  const {
    token,
    filter_time, // 毫秒时间戳
    filter_followers, // 最小粉丝数
    add_user_list, // array<Int>
    sub_user_list, // array<Int>
    ttl, // 天数
    volatility, // 波动率（-1 ~ 1）
    bubble_num, // 总节点数
    top_ratio, // Top 样本比例（0～1），如 0.3
  } = params;

  // 1) 计算部分数量
  const topCount = Math.ceil(bubble_num * top_ratio);
  const addCount = add_user_list.length;
  const remainCount = bubble_num - topCount - addCount;
  // 根据 volatility 简单分配剩余正负数量
  const posCount = Math.round(remainCount * (0.5 + volatility / 2));
  const negCount = remainCount - posCount;

  // 子列表过滤
  const subFilter =
    sub_user_list.length > 0
      ? `AND author_id NOT IN (${sub_user_list.join(",")})`
      : "";
  // 自定义加入列表
  const addUserFilter =
    add_user_list.length > 0
      ? `WHERE id IN (${add_user_list.join(",")})`
      : "WHERE 1 = 0";

  return `
WITH
  toDateTime(${filter_time} / 1000)                              AS ts,
  ${ttl}                                                        AS ttl_days,
  toDateTime(( ${filter_time} - ttl_days * 86400000 ) / 1000)   AS ts_start

, raw AS (
    SELECT author_id, username, name, followers, CAST(score AS Float32) AS score_metrics, created
    FROM user_graph_detail_score
    WHERE active_type = 'comment'
      AND label = '${token}'
      AND created <= ${filter_time}
      AND created > ${filter_time} - ttl_days * 86400000
      AND followers >= ${filter_followers}
      ${subFilter}
)

, aggregated AS (
    SELECT
      author_id,
      anyLast(username)  AS username,
      anyLast(name)      AS name,
      anyLast(followers) AS followers,
      sum(score_metrics * (1 - age_days/ttl_days))
        / sum(1 - age_days/ttl_days)                     AS score_metrics,
      1 - max(age_days)/ttl_days                         AS opacity
    FROM (
      SELECT *, dateDiff('second', toDateTime(created/1000), ts)/86400.0 AS age_days
      FROM raw
    )
    GROUP BY author_id
)

-- Top 粉丝的大V
, top_users AS (
    SELECT author_id, username, name, followers, score_metrics, opacity
    FROM aggregated
    ORDER BY followers DESC
    LIMIT ${topCount}
)
, top_ids AS (
    SELECT author_id FROM top_users
)

-- 分离正/负情绪
, positive AS (SELECT * FROM aggregated WHERE score_metrics > 0 AND author_id NOT IN (SELECT author_id FROM top_ids))
, negative AS (SELECT * FROM aggregated WHERE score_metrics < 0 AND author_id NOT IN (SELECT author_id FROM top_ids))

-- 剩余部分：按粉丝降序取 posCount、negCount
, sampled_pos AS (
    SELECT author_id, username, name, followers, score_metrics, opacity
    FROM positive
    ORDER BY followers DESC
    LIMIT ${posCount}
)
, sampled_neg AS (
    SELECT author_id, username, name, followers, score_metrics, opacity
    FROM negative
    ORDER BY followers DESC
    LIMIT ${negCount}
)

-- 自定义加入
, add_users AS (
    SELECT id AS author_id, username, name, followers, CAST(0.0 AS Float32) AS score_metrics, 1.0 AS opacity
    FROM user_info
    ${addUserFilter}
)

-- 合并最终结果
SELECT author_id, username, name, followers, score_metrics, opacity FROM top_users
UNION ALL
SELECT author_id, username, name, followers, score_metrics, opacity FROM sampled_pos
UNION ALL
SELECT author_id, username, name, followers, score_metrics, opacity FROM sampled_neg
UNION ALL
SELECT author_id, username, name, followers, score_metrics, opacity FROM add_users;
`;
}

function buildGraphLinksSQL(params: ForceGraphParams) {
  const {
    token,
    filter_time, // 毫秒时间戳
    filter_followers, // 最小粉丝数
    add_user_list, // array<Int>
    sub_user_list, // array<Int>
    ttl, // 天数
    volatility, // 波动率（-1 ~ 1）
    bubble_num, // 总节点数
    top_ratio, // Top 样本比例（0～1），如 0.3
    nodes,
  } = params;
  if (!nodes || nodes.length === 0) {
    throw new Error("nodes is empty");
  }
  const userIds = nodes.map((node) => node.id);
  const userIdsStr = userIds.join(",");
  return `
    WITH
    -- 三种行为的权重，可按需调整
    0.6 AS w_comment,
    0.3 AS w_retweet,
    0.1 AS w_follow

-- 1) 先算出每个方向（A→B）的加权平均分
, ds AS (
    SELECT
        author_id     AS source_id,
        label_user_id AS target_id,
        sum(score *
            CASE active_type
                WHEN 'comment'  THEN w_comment
                WHEN 'retweeted' THEN w_retweet
                WHEN 'follow'    THEN w_follow
                ELSE 0
            END
        )
        /
        sum(
            CASE active_type
                WHEN 'comment'  THEN w_comment
                WHEN 'retweeted' THEN w_retweet
                WHEN 'follow'    THEN w_follow
                ELSE 0
            END
        )                  AS source2target_score
    FROM user_graph_detail_score
    WHERE
        object_type = 'user'
        AND created <= ${filter_time}
        AND created > ${filter_time} - ${ttl} * 86400000
        AND author_id     IN (${userIdsStr})
        AND label_user_id IN (${userIdsStr})
    GROUP BY source_id, target_id
)

-- 2) 对于存在 A→B 记录的行，LEFT JOIN 取出 B→A（如果有）
, directional AS (
    SELECT
        d1.source_id,
        d1.target_id,
        d1.source2target_score,
        d2.source2target_score AS target2source_score
    FROM ds AS d1
    LEFT JOIN ds AS d2
      ON d1.source_id = d2.target_id
     AND d1.target_id = d2.source_id
)

-- 3) 对于只有 B→A 而没有 A→B 的情形，需要补一行 (A,B) 且 A→B=NULL
-- 3) 对于只有 B→A 而没有 A→B 的情形，需要补一行 (A,B) 且 A→B=NULL
, inverse_only AS (
    SELECT
        d2.target_id AS source_id,
        d2.source_id AS target_id,
        CAST(NULL AS Nullable(Float64)) AS source2target_score,
        d2.source2target_score AS target2source_score
    FROM ds AS d2
    LEFT JOIN ds AS d1
      ON d1.source_id = d2.target_id
     AND d1.target_id = d2.source_id
    WHERE d1.source_id IS NULL
)


-- 4) 合并并排序
SELECT source_id, target_id, source2target_score, target2source_score 
FROM directional
WHERE source_id <> target_id
AND source2target_score + target2source_score  > 30
UNION ALL
SELECT source_id, target_id, source2target_score, target2source_score FROM inverse_only
WHERE source_id <> target_id
AND source2target_score + target2source_score  > 30;`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      token,
      filter_time,
      filter_followers,
      add_user_list = [],
      sub_user_list = [],
      ttl = 60,
      volatility,
      bubble_num = 150,
      top_ratio = 0.3,
    } = body;
    const nodesSql = buildGraphNodesSQL({
      token,
      filter_time,
      filter_followers,
      add_user_list,
      sub_user_list,
      ttl,
      volatility,
      bubble_num,
      top_ratio,
    });
    const rawNodes = await queryClickhouse(nodesSql);

    const nodes: GraphNode[] = rawNodes.map((row) => ({
      ...row,
      id: row.author_id.toString(),
      followers: Number(row.followers),
    }));
    // 计算每个节点的粉丝占比
    const totalFollowers = nodes.reduce((acc, node) => acc + node.followers, 0);
    // 判断用户是否为 Top，取粉丝数前 15% 的用户
    const sorted = [...nodes].sort((a, b) => b.percentage - a.percentage);
    const topCount = Math.ceil(nodes.length * 0.15);
    const topIds = new Set(sorted.slice(0, topCount).map((n) => n.id));

    nodes.forEach((node) => {
      node.percentage = (node.followers / totalFollowers) * 100;
      node.isTop = topIds.has(node.id);
    });
    const linksSql = buildGraphLinksSQL({
      token,
      filter_time,
      filter_followers,
      add_user_list,
      sub_user_list,
      ttl,
      volatility,
      bubble_num,
      top_ratio,
      nodes,
    });
    const rawLinks: GraphLinkRaw[] = await queryClickhouse(linksSql);
    const links: GraphLink[] = rawLinks.map((row) => ({
      source: row.source_id.toString(),
      target: row.target_id.toString(),
      source2target_score: Number(row.source2target_score),
      target2source_score: Number(row.target2source_score),
    }));
    return ok({ nodes, links });
  } catch (error: any) {
    console.error("查询失败:", error.message);
    return fail("Query failed");
  }
}
