// 新闻事件主结构
export interface NewsEvent {
  report_id: string; // 文章/报告的唯一标识符
  event_id: string; // 事件的唯一标识符
  event_title: string; // 事件核心标题
  event_influence: number; // 事件影响力 (0~100)
  event_timestamp: number; // 事件发生时间或报告时间
  summary: string; // 事件摘要
  sentiment_score: number; // 情绪评分 (-1~1)
  sentiment_label: "Positive" | "Neutral" | "Negative"; // 情绪标签
  key_entities: Entity[]; // 关键实体
  event_categories: EventCategory[]; // 事件分类标签
  causal_analysis: CausalRelation[]; // 因果关系分析
  historical_analogues: HistoricalAnalogue[]; // 历史相似事件 + 宏观和微观指数
}

// 实体信息（人物、组织、项目等）
export interface Entity {
  name: string; // 实体名称
  type: string; // 实体类型
  entity_id?: string; // 可选：链接到知识库或数据库的 ID
}

// 分类标签（如监管/创新）
export interface EventCategory {
  category_name: string; // 更易读的分类名称
  category_code?: string; // 可选：内部使用的代码
}

// 因果分析链
export interface CausalRelation {
  cause: string; // 主要原因/背景
  trigger: string; // 触发该因果链的具体动作/子事件
  effect: string | CausalRelation; // 直接导致的后果/影响
}

export interface HistoricalAnalogue {
  historical_case_summary: string; // 相似历史事件的描述
  historical_event_date: string; // 历史事件发生的大致日期/年份
  similarity_description: string; // 与当前事件的相似之处
  related_report_id?: string; // 指向相关历史事件/报告的 ID (如有)
  market_indicator?: MarketIndicator; // 市场波动指标
}

// 市场指标（指数表现）
export interface MarketIndicator {
  crypto?: string; // 加密货币指数
  djia?: string; // 道琼斯工业平均指数
  ndx?: string; // 纳斯达克 100 指数
}
