import {clickHouseClient} from '@/http/server'
/**
 * 执行ClickHouse查询
 * @param query SQL查询语句
 * @param format 返回数据格式，默认为JSON
 * @returns 查询结果
 */
export async function queryClickHouse(query: string, format: string = 'JSON') {
  return await clickHouseClient.query({
    query,
    format: format as any, // 类型转换
  })
}

