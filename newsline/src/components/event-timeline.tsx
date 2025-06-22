import React from "react";
import { EventTimelineItem } from "@/types/report";
import { CalendarDays, Clock, ExternalLink, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface EventTimelineProps {
  timeline: EventTimelineItem[];
}

export function EventTimeline({ timeline }: EventTimelineProps) {
  // 按日期排序
  const sortedTimeline = [...timeline].sort((a, b) => {
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });

  return (
    <div className="flex flex-col space-y-4">
      {sortedTimeline.map((item, index) => (
        <div key={`timeline-${index}`} className="relative">
          {/* 连接线 */}
          {index < sortedTimeline.length - 1 && (
            <div className="absolute left-6 top-12 h-full w-0.5 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
          )}

          <div className="flex items-start gap-4">
            {/* 时间点标记 */}
            <div className="relative flex flex-col items-center">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-gray-900 ${getSentimentBgColor(item.sentiment_score)}`}>
                <Clock className="h-5 w-5 text-white" />
              </div>

              {/* 情感强度指示器 */}
              {Math.abs(item.sentiment_score || 0) > 0.6 && (
                <div className="mt-1 flex items-center justify-center">
                  <AlertCircle className={`h-3 w-3 ${getSentimentTextColor(item.sentiment_score)}`} />
                </div>
              )}
            </div>

            {/* 内容卡片 */}
            <div className="flex-1 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
              {/* 顶部情感条 */}
              <div className={`h-1 w-full ${getSentimentBgColor(item.sentiment_score)}`}></div>

              <div className="p-5">
                {/* 标题和日期 */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarDays className="h-4 w-4" />
                      <span className="font-medium">{formatDate(item.event_date)}</span>
                    </div>

                    {/* 情感分数标签 */}
                    {item.sentiment_score !== undefined && (
                      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${getSentimentBadgeColor(item.sentiment_score)}`}>
                        {item.sentiment_score > 0 ? (
                          <TrendingUp className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5" />
                        )}
                        <span className="text-xs font-semibold">
                          {item.sentiment_score > 0 ? '+' : ''}{(item.sentiment_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 底部操作区 */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  {/* 影响等级指示器 */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">影响等级</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={`impact-${i}`}
                          className={`h-2 w-2 rounded-full ${
                            i < getImpactLevel(item.sentiment_score)
                              ? getSentimentDotColor(item.sentiment_score)
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 来源链接 */}
                  {item.source_url ? (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>查看来源</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500">暂无来源</span>
                  )}
                </div>
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
    day: 'numeric',
    weekday: 'short'
  });
}

// 根据情感分数计算影响等级 (1-5)
function getImpactLevel(sentimentScore?: number): number {
  if (!sentimentScore) return 2;
  const absScore = Math.abs(sentimentScore);
  if (absScore >= 0.8) return 5;
  if (absScore >= 0.6) return 4;
  if (absScore >= 0.4) return 3;
  if (absScore >= 0.2) return 2;
  return 1;
}

// 背景颜色
function getSentimentBgColor(sentimentScore?: number): string {
  if (!sentimentScore) return "bg-gray-500 dark:bg-gray-600";
  if (sentimentScore > 0.3) return "bg-green-500 dark:bg-green-600";
  if (sentimentScore < -0.3) return "bg-red-500 dark:bg-red-600";
  return "bg-yellow-500 dark:bg-yellow-600";
}

// 文本颜色
function getSentimentTextColor(sentimentScore?: number): string {
  if (!sentimentScore) return "text-gray-500 dark:text-gray-400";
  if (sentimentScore > 0.3) return "text-green-600 dark:text-green-400";
  if (sentimentScore < -0.3) return "text-red-600 dark:text-red-400";
  return "text-yellow-600 dark:text-yellow-400";
}

// 标签背景颜色
function getSentimentBadgeColor(sentimentScore: number): string {
  if (sentimentScore > 0.3) return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  if (sentimentScore < -0.3) return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
}

// 小圆点颜色
function getSentimentDotColor(sentimentScore?: number): string {
  if (!sentimentScore) return "bg-gray-400";
  if (sentimentScore > 0.3) return "bg-green-500";
  if (sentimentScore < -0.3) return "bg-red-500";
  return "bg-yellow-500";
}
