import { createClient } from '@clickhouse/client'


export const clickhouseClient = createClient({
  url: `http://${process.env.CK_HOST}:${process.env.CK_PORT}`,
  username: process.env.CK_USERNAME!,
  password: process.env.CK_PASSWORD!,
  database: process.env.CK_DATABASE || "default",
  clickhouse_settings: {
    async_insert: 1,
    wait_for_async_insert: 1,
  },
  // 仅查询相关配置
  max_open_connections: 10, // 连接池大小
  keep_alive: {
    enabled: true,
    idle_socket_ttl: 25000,
  }
})
