// 数据库中的新闻事件结构
export interface INewsEvent {
  id: number; // 主键ID
  report_title: string; // 报告标题
  executive_summary: string; // 报告摘要
  overall_sentiment_score: number; // 情绪评分
  analysis_date: string; // 分析日期
  start_date: string | null; // 事件起始日期
  market_data: IMarketData | null; // 市场数据
  token: string; // 代币符号
  key_entities: IKeyEntity[] | null; // 关键实体
  historical_comparisons: IHistoricalComparison[] | null; // 历史比较
  causal_inferences: ICausalInference[] | null; // 因果推断
  event_timeline: IEventTimelineItem[] | null; // 事件时间线
  created_at: string; // 记录创建时间
  citations: ICitation[] | null; // 引用来源
  viewpoint: IViewpoint[] | null; // 观点

  event_timestamp: number; // 转换后的时间戳，用于图表显示
  sentiment_label: "Positive" | "Negative" | "Neutral"; // 情绪标签
  event_influence: number; // 事件影响力 (0~100)
}

// 市场数据
export interface IMarketData {
  meta?: {
    target_date: string;
  };
  indicators?: {
    [key: string]: {
      date: string;
      volatility: string;
      daily_change_pct: string;
      daily_change_value: string;
    }
  };
  market_daily_change?: {
    [key: string]: {
      date: string;
      volatility: string;
      daily_change_pct: string;
      daily_change_value: string;
    }
  };
}

// 关键实体
export interface IKeyEntity {
  name: string; // 实体名称
  type: string; // 实体类型
  role: string; // 实体角色
  id?: string; // 可选：实体ID
}

// 历史比较
export interface IHistoricalComparison {
  event_date: string; // 事件日期
  event_summary: string; // 事件总结
  outcome_and_lessons: string; // 结局与教训
  similarity_label: string; // 相似标签
  market_indicator: Record<string, string>; // 市场指标，从market_data中提取
  sentiment_score: number, // 情绪分，-1~1
}

// 因果推断
export interface ICausalInference {
  cause: string; // 原因
  effect: string | ICausalInference; // 结果或递归的因果链
  evidence: string; // 证据（在前端显示为trigger）
  confidence: number;
  source_url: string | null;
  sentiment_score: number;
}

// 事件时间线项
export interface IEventTimelineItem {
  title: string; // 事件标题
  event_date: string; // 事件日期
  source_url: string | null;
  sentiment_score: number;
}

// 引用来源
export interface ICitation {
  url: string; // URL链接
  title?: string; // 可选：标题
  source?: string; // 可选：来源
  date?: string; // 可选：日期
}

// 观点
export interface IViewpoint {
  entity: string; // 发表观点的实体
  viewpoint: string; // 观点内容
  source_url: string | null; // 来源URL
}

// 因果分析链
export interface ICausalRelation {
  cause: string; // 原因
  trigger: string; // 触发因素（对应数据库中的evidence）
  effect: string | ICausalRelation; // 结果或递归的因果链
  confidence?: number; // 置信度
}

// 历史类比
export interface IHistoricalAnalogue {
  historical_case_summary: string; // 历史事件摘要（对应数据库中的event_summary）
  historical_event_date: string; // 历史事件日期（对应数据库中的event_date）
  similarity_description: string; // 相似性描述（对应数据库中的similarity_label）
  outcome_and_lessons?: string; // 结局与教训
  id?: string; // 历史事件ID
  market_indicator?: Record<string, string>; // 市场指标
}
