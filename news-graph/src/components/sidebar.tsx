"use client";

import React from "react";
import { useEventStore } from "@/stores/eventStore";
import NewsItem from "./sidebar-list/news-item";

interface Event {
  id: number;
  input_label?: string;
  event_title: string;
  created_at: string;
}

interface SidebarProps {
  events: Event[];
}

export default function Sidebar({ events = [] }: SidebarProps) {
  // 从状态存储中获取当前选中的事件ID和设置事件ID的方法
  const { currentEventId, setCurrentEvent } = useEventStore();

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
    <aside className="h-full w-full overflow-hidden bg-[rgba(135,145,171,0.08)] pt-6">
      <div className="flex h-full flex-col border-r border-[#8791AB]/20">
        <div className="mb-1 h-6 px-4 text-[18px] leading-6">🔥 Hot</div>
        <div className="flex-1 overflow-scroll backdrop-blur-[30px]">
          <div className="flex cursor-pointer flex-col">
            {events.length === 0 ? (
              <div className="p-4 text-gray-400">No Events</div>
            ) : (
              events.map((event: Event) => (
                <NewsItem
                  key={event.id}
                  item={{
                    id: event.id.toString(),
                    title: event.input_label || event.event_title,
                    time: formatDate(event.created_at),
                    tags: []
                  }}
                  isSelected={event.id === currentEventId}
                  onClick={() => setCurrentEvent(event.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
