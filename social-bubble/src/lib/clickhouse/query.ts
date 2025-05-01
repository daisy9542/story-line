import { clickhouseClient } from "@/http/server/clickhouse-http";

export async function queryClickhouse<T = any>(
  sql: string,
  params: Record<string, any> = {},
): Promise<T[]> {
  const resultSet = await clickhouseClient.query({
    query: sql,
    format: "JSONEachRow",
    query_params: params,
  });
  return await resultSet.json();
}
