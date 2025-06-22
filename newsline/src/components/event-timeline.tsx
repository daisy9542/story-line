import React from "react";
import { EventTimelineItem } from "@/types/report";
import { CalendarDays, Clock, ArrowUp, ArrowDown, ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

interface EventTimelineProps {
  timeline: EventTimelineItem[];
}

export function EventTimeline({ timeline }: EventTimelineProps) {
  // 按日期排序
  const sortedTimeline = [...timeline].sort((a, b) => {
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });

  return (
    <div className="flex flex-col space-y-6">
      {sortedTimeline.map((item, index) => (
        <div key={`timeline-${index}`} className="relative">
          {/* 连接线 */}
          {index < sortedTimeline.length - 1 && (
            <div className="absolute left-4 top-8 h-full w-0.5 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
          )}

          <div className="flex items-start gap-4">
            {/* 时间点标记 - 根据情感分数调整颜色 */}
            <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm ${getSentimentColor(item.sentiment_score)}`}>
              <Clock className="h-4 w-4 text-white" />
              {/* 重要性环形指示器 */}
              {item.importance && item.importance > 7 && (
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></div>
              )}
            </div>

            {/* 内容卡片 */}
            <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {/* 标题行 */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                    {item.title}
                  </h3>

                  {/* 日期 */}
                  <div className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{formatDate(item.event_date)}</span>
                  </div>
                </div>

                {/* 情感分数指示器 */}
                {item.sentiment_score !== undefined && (
                  <div className="flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 dark:bg-gray-700">
                    {item.sentiment_score > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${getSentimentTextColor(item.sentiment_score)}`}>
                      {item.sentiment_score > 0 ? '+' : ''}{(item.sentiment_score * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>

              {/* 描述 */}
              {item.description && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* 底部信息栏 */}
              <div className="mt-3 flex items-center justify-between">
                {/* 重要性指标 */}
                {item.importance && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">影响力</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={`impact-${i}`}
                          className={`h-1.5 w-1.5 rounded-full ${
                            i < Math.round(item.importance! / 2)
                              ? getImportanceColor(item.importance!)
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {item.importance}/10
                      </span>
                    </div>
                  </div>
                )}

                {/* 来源链接 */}
                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>查看来源</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// 根据情感分数返回颜色
function getSentimentColor(sentimentScore?: number): string {
  if (!sentimentScore) return "bg-gray-500 dark:bg-gray-600";

  if (sentimentScore > 0.3) return "bg-green-500 dark:bg-green-600";
  if (sentimentScore < -0.3) return "bg-red-500 dark:bg-red-600";
  return "bg-yellow-500 dark:bg-yellow-600";
}

// 根据情感分数返回文本颜色
function getSentimentTextColor(sentimentScore: number): string {
  if (sentimentScore > 0.3) return "text-green-600 dark:text-green-400";
  if (sentimentScore < -0.3) return "text-red-600 dark:text-red-400";
  return "text-yellow-600 dark:text-yellow-400";
}

// 根据重要性返回颜色
function getImportanceColor(importance: number): string {
  if (importance >= 8) return "bg-red-500 dark:bg-red-600";
  if (importance >= 6) return "bg-orange-500 dark:bg-orange-600";
  if (importance >= 4) return "bg-blue-500 dark:bg-blue-600";
  return "bg-gray-400 dark:bg-gray-600";
}
