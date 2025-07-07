"use client";

import CandleChart from "@/components/candle-chart";
import { ThemeToggle } from "@/components/theme-toggle";
import TokenSelector from "@/components/token-selector";
import NewsEvents from "@/components/news-events";
import Danmaku from "@/components/danmaku";
import TradingInfoHeader from "@/components/trading-info-header";
import { INewsEvent } from "@/types/report";
import { useEffect, useState, useCallback } from "react";
import { useNewslineStore } from "@/stores/newsline-store";
import { http } from "@/lib/axios";

export default function HomePage() {
  const { selectedTokenSymbol, currentTimeRange } = useNewslineStore();
  const [eventsData, setEventsData] = useState<INewsEvent[]>([]);
  const [flag, setFlag] = useState(false);
  const [tradingData, setTradingData] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
    timestamp?: number;
  }>({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  });
  const [isLoadingTradingData, setIsLoadingTradingData] = useState(true);

  const handleTradingDataUpdate = useCallback((data: {
    open: number;
    high: number;
    low: number;
    close: number;
    timestamp?: number;
  }) => {
    setTradingData(data);
    setIsLoadingTradingData(false);
  }, []);

  // 监听币种变化，重置交易数据加载状态
  useEffect(() => {
    setIsLoadingTradingData(true);
  }, [selectedTokenSymbol]);

  useEffect(() => {
    if (flag) return;
    const { from, to } = currentTimeRange;
    if (from === 0 && to === 0) {
      return;
    }
    const fetchEvents = async () => {
      try {
        const events = (await http.get("/events", {
          from,
          to,
          symbol: selectedTokenSymbol,
        })) as INewsEvent[];

        setEventsData(events);
      } catch (err) {
        console.error("加载事件数据失败:", err);
      }
    };
    fetchEvents();
    setFlag(true);
  }, [currentTimeRange, flag, selectedTokenSymbol]);

  return (
    <main className="flex h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4">
        <TokenSelector />
        <div className="flex gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* 交易信息头部 */}
      <TradingInfoHeader
        symbol={selectedTokenSymbol}
        data={tradingData}
        loading={isLoadingTradingData}
      />

      <div className="flex h-full flex-1 flex-col gap-3 overflow-hidden p-4 md:flex-row">
        <section className="relative flex min-h-[500px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 p-4 dark:border-[#171D24] dark:bg-[#111111]">
          <Danmaku />
          <div className="flex-1">
            <CandleChart
              newsEvents={eventsData}
              onDataUpdate={handleTradingDataUpdate}
            />
          </div>
        </section>
        <aside className="h-64 w-full flex-shrink-0 rounded-xl border border-gray-200 md:h-full md:max-h-screen md:w-[350px] dark:border-[#171D24]">
          <NewsEvents newsEvents={eventsData} />
        </aside>
      </div>
    </main>
  );
}
