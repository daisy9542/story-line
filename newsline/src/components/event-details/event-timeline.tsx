import React from "react";
import { EventTimelineItem } from "@/types/report";
import { CalendarDays, ExternalLink } from "lucide-react";
import { formatDate, getSentimentColor } from "@/lib/utils";

interface EventTimelineProps {
  timeline: EventTimelineItem[];
}

export function EventTimeline({ timeline }: EventTimelineProps) {
  // 按日期排序
  const sortedTimeline = [...timeline].sort((a, b) => {
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedTimeline.map((item, index) => (
        <div key={`timeline-${index}`} className="relative">
          {/* 连接线 */}
          {index < sortedTimeline.length - 1 && (
            <div className="absolute left-2 top-6 h-full w-px bg-gray-300 dark:bg-gray-600" />
          )}

          <div className="flex gap-3">
            {/* 时间点 - 使用通用颜色函数 */}
            <div className="relative flex-shrink-0 pt-2">
              <div
                className={`h-4 w-4 rounded-full ${getSentimentColor(item.sentiment_score, 'bg')}`}
              />
            </div>

            {/* 内容卡片 */}
            <div className="flex-1 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              {/* 标题 */}
              <h3 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
                {item.title}
              </h3>

              {/* 底部信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(item.event_date)}</span>
                </div>

                {/* 只在有来源时显示链接 */}
                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    <ExternalLink className="h-3 w-3" />
                    来源
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
