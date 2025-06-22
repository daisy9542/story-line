import React from "react";
import { EventTimelineItem } from "@/types/report";
import { CalendarDays, Clock, ArrowUp, ArrowDown } from "lucide-react";

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
            <div className="absolute left-3.5 top-6 h-full w-0.5 bg-gray-300 dark:bg-gray-700" />
          )}

          <div className="flex items-start gap-3">
            {/* 时间点标记 */}
            <div className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${getImportanceColor(item.importance)}`}>
              <Clock className="h-3.5 w-3.5 text-white" />
            </div>

            {/* 内容 */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{item.title}</h3>
                {item.importance && item.importance > 7 && (
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    重要
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{formatDate(item.event_date)}</span>
              </div>

              {item.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              )}

              {/* 重要性指标 */}
              {item.importance && (
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">影响力:</span>
                  <div className="flex items-center">
                    {Array.from({ length: Math.min(Math.round(item.importance / 2), 5) }).map((_, i) => (
                      <div
                        key={`impact-${i}`}
                        className={`h-1.5 w-1.5 rounded-full ${getImportanceColor(item.importance)} mr-0.5`}
                      />
                    ))}
                  </div>
                  {item.importance > 5 ? (
                    <ArrowUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              )}
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

// 根据重要性返回颜色
function getImportanceColor(importance?: number): string {
  if (!importance) return "bg-gray-400 dark:bg-gray-600";

  if (importance >= 8) return "bg-red-500 dark:bg-red-600";
  if (importance >= 6) return "bg-orange-500 dark:bg-orange-600";
  if (importance >= 4) return "bg-blue-500 dark:bg-blue-600";
  return "bg-gray-400 dark:bg-gray-600";
}
