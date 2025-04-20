import { createClient } from '@clickhouse/client'


export const clickHouseClient = createClient({
  url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DB || 'default',
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
