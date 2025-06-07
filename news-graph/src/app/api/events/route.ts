import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { transformDataToGraph } from '@/lib/data-transformer';

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'news_graph',
};

export async function GET() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection(dbConfig);

    // 查询所有事件数据
    const [rows] = await connection.execute('SELECT * FROM event_analysis') as [any[], any];
    console.log(rows);

    // 关闭连接
    await connection.end();

    // 将数据库结果转换为前端需要的格式
    const events = rows.map((row: any) => {
      // 解析JSON字段
      const entities = typeof row.entities === 'string' ? JSON.parse(row.entities) : row.entities;
      const historical_similar_events = typeof row.historical_similar_events === 'string'
        ? JSON.parse(row.historical_similar_events)
        : row.historical_similar_events;
      const event_lines = typeof row.event_lines === 'string'
        ? JSON.parse(row.event_lines)
        : row.event_lines;
      const causal_inference = typeof row.causal_inference === 'string'
        ? JSON.parse(row.causal_inference)
        : row.causal_inference;
      const citations = typeof row.citations === 'string'
        ? JSON.parse(row.citations)
        : row.citations || [];

      // 构造事件对象
      return {
        id: row.id,
        event_title: row.event_title,
        input_label: row.input_label || row.event_title,
        background_analysis: row.background_analysis,
        viral_potential: row.viral_potential,
        negative_events_identification: row.negative_events_identification,
        causal_inference,
        entities,
        historical_similar_events,
        sentiment_score: row.sentiment_score,
        event_lines,
        created_at: row.created_at,
        citations,
        // 转换为图表数据
        graphData: transformDataToGraph({
          event_title: row.event_title,
          background_analysis: row.background_analysis,
          viral_potential: row.viral_potential,
          negative_events_identification: row.negative_events_identification,
          causal_inference,
          entities,
          historical_similar_events,
          sentiment_score: row.sentiment_score,
          event_lines,
          citations,
          created_at: row.created_at,
        })
      };
    });

    return NextResponse.json(events);
  } catch (err) {
    console.error('Error fetching events from database:', err);
    return NextResponse.json(
      { error: 'Failed to fetch events from database' },
      { status: 500 }
    );
  }
}
