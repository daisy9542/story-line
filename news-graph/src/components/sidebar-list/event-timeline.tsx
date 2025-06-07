import React from "react";

interface EventLine {
  event: string;
  sentiment: number;
  date: string;
  url: string;
}

interface EventTimelineProps {
  events: EventLine[];
}

export default function EventTimeline({ events }: EventTimelineProps) {
  // 根据情感值获取颜色
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.5) return "bg-green-500";
    if (sentiment > 0) return "bg-green-300";
    if (sentiment > -0.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);

      // 获取月份（需要+1因为月份从0开始）
      const month = String(date.getMonth() + 1).padStart(2, '0');

      // 获取日期
      const day = String(date.getDate()).padStart(2, '0');

      // 获取年份
      const year = date.getFullYear();

      // 返回格式化的日期字符串：MM/DD YYYY
      return `${month}/${day} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex items-start space-x-3">
          {/* 左侧情感圆圈和连接线 */}
          <div className="flex flex-col items-center">
            <div
              className={`h-3 w-3 rounded-full mt-1 ${getSentimentColor(
                event.sentiment
              )}`}
            ></div>
            {index < events.length - 1 && (
              <div className="h-full w-0.5 bg-gray-700"></div>
            )}
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 space-y-2">
            {/* 上部分：标题 */}
            <p className="text-[14px] leading-4 font-light">{event.event}</p>

            {/* 下部分：左侧时间，右侧source */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {formatDate(event.date)}
              </span>

              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline"
                >
                  Source
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}