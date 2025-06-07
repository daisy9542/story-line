"use client";

import { useEffect, useState } from "react";
import GraphContainer from "@/components/graph/graph-container";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import AnalysisContainer from "@/components/sidebar-list/analysis-container";
import { useEventStore } from "@/stores/eventStore";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiAttempted, setApiAttempted] = useState(false);

  // 从状态存储中获取当前选中的事件ID和设置事件ID的方法
  const { currentEventId, setCurrentEvent } = useEventStore();

  // 当前选中的事件
  const currentEvent = events.find(event => event.id === currentEventId);

  // 获取所有事件数据 - 只在组件挂载时获取一次
  useEffect(() => {
    async function fetchEvents() {
      if (apiAttempted) return; // 防止重复请求

      setApiAttempted(true);
      try {
        setLoading(true);

        // 添加超时处理
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("请求超时")), 10000)
        );

        const fetchPromise = fetch("/api/events");

        // 使用Promise.race来处理超时
        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

        if (!response.ok) {
          throw new Error(`请求失败: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("API返回的数据不是数组或为空，使用备用数据");
        } else {
          setEvents(data);
        }

        setError(null);
      } catch (err) {
        console.error("获取事件数据失败:", err);
        setError(`获取数据失败: ${err instanceof Error ? err.message : '未知错误'}`);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [apiAttempted]); // 只依赖apiAttempted，防止重复请求

  // 当events变化且没有选中事件时，选择第一个事件
  useEffect(() => {
    if (events.length > 0 && currentEventId === null) {
      setCurrentEvent(events[0].id);
    }
  }, [events, currentEventId, setCurrentEvent]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500 mx-auto"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <p className="mt-2 text-sm">请检查API路由 /api/events 是否存在并正常工作</p>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => {
              setApiAttempted(false);
              setError(null);
            }}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 如果没有事件数据，显示错误
  if (events.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">没有找到事件数据</p>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => {
              setApiAttempted(false);
              setError(null);
            }}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  // 如果没有选中的事件，但有事件列表，使用第一个事件
  if (!currentEvent && events.length > 0) {
    const firstEvent = events[0];

    // 构建分析数据
    const analysisData = [
      {
        title: "Event Background",
        content: firstEvent.background_analysis,
      },
      {
        title: "Viral Potential",
        content: firstEvent.viral_potential,
      },
      {
        title: "Negative Event",
        content: firstEvent.negative_events_identification,
      },
      {
        title: "Causal Inference",
        content: firstEvent.causal_inference?.effect,
      },
    ];

    // 直接渲染页面，不要再次触发状态更新
    return (
      <div className="relative flex h-screen flex-1 flex-col">
        <Header />
        <main className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex h-full w-full flex-1 items-start">
            <div className="h-full w-[314px]">
              <Sidebar events={events} />
            </div>
            <section className="relative z-20 h-full flex-1">
              <GraphContainer graphData={firstEvent.graphData || { nodes: [], edges: [] }} />
              <div className="absolute top-6 right-6 h-[500px] w-[320px] shadow-lg z-100">
                <AnalysisContainer
                  eventTitle={firstEvent.input_label || firstEvent.event_title}
                  analysisData={analysisData}
                  eventLines={firstEvent.event_lines || []}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // 正常渲染选中的事件
  // 构建分析数据
  const analysisData = [
    {
      title: "Event Background",
      content: currentEvent?.background_analysis || "无背景分析",
    },
    {
      title: "Viral Potential",
      content: currentEvent?.viral_potential || "无病毒潜力分析",
    },
    {
      title: "Negative Event",
      content: currentEvent?.negative_events_identification || "无负面事件识别",
    },
    {
      title: "Causal Inference",
      content: currentEvent?.causal_inference?.effect || "无因果推断",
    },
  ];

  return (
    <div className="relative flex h-screen flex-1 flex-col">
      <Header />

      <main className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex h-full w-full flex-1 items-start">
          <div className="h-full w-[314px]">
            <Sidebar events={events} />
          </div>
          <section className="relative z-20 h-full flex-1">
            <GraphContainer graphData={currentEvent?.graphData || { nodes: [], edges: [] }} />
            <div className="absolute top-6 right-6 h-[500px] w-[320px] shadow-lg z-100">
              <AnalysisContainer
                eventTitle={currentEvent?.input_label || currentEvent?.event_title || ""}
                analysisData={analysisData}
                eventLines={currentEvent?.event_lines || []}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
