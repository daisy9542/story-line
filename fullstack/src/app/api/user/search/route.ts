import { NextRequest } from "next/server";

import { SimpleKOL } from "@/types/kol";
import { fail, ok } from "@/lib/api/response";
import { queryClickhouse } from "@/lib/clickhouse/query";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kw = searchParams.get("query")?.trim();
  if (!kw) {
    return fail("Missing search keyword", 400);
  }

  try {
    const rawData: SimpleKOL[] = await queryClickhouse(
      `
      WITH
          {kw:String}          AS kw
      ,   lower({kw:String})   AS kw_lc

      SELECT
          id,
          username,
          name,
          followers
      FROM user_info
      WHERE
           match(coalesce(username, ''), kw)
        OR match(coalesce(name,     ''), kw)
      ORDER BY
          (startsWith(lower(username), kw_lc)
        OR startsWith(lower(name),     kw_lc)) DESC,
          (match(coalesce(username, ''), kw) * 2
         + match(coalesce(name,     ''), kw) * 1)         DESC,
          followers                                        DESC
      LIMIT 50
      `,
      { kw },
    );
    const data = rawData.map((row) => ({
      ...row,
      followers: Number(row.followers),
    }));
    return ok(data);
  } catch (error: any) {
    console.error("Search kol failed:", error);
    return fail("Search kol failed");
  }
}
