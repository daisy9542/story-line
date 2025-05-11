"use client";

import CandleChart from "@/components/candle-chart";
import { ThemeToggle } from "@/components/theme-toggle";
import TokenSelector from "@/components/token-selector";
import NewsEvents from "@/components/news-events";
import { NewsEvent } from "@/types/news";
import { useEffect, useState } from "react";
import { useNewslineStore } from "@/stores/newsline-store";
import { http } from "@/lib/axios";

export default function HomePage() {
  const { selectedTokenSymbol, currentTimeRange } = useNewslineStore();
  const [eventsData, setEventsData] = useState<NewsEvent[]>([]);
  const [flag, setFlag] = useState(false);

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
        })) as NewsEvent[];
        setEventsData(events);
      } catch (err) {
        console.error("加载事件数据失败:", err);
      }
    };
    fetchEvents();
    setFlag(true);
  }, [currentTimeRange]);

  return (
    <main className="flex h-screen flex-col">
      <header className="flex h-16 items-center justify-between px-4">
        <TokenSelector />
        <div className="flex gap-2">
          <ThemeToggle />
        </div>
      </header>

      <div className="flex h-full flex-1 flex-col gap-3 overflow-hidden p-4 md:flex-row">
        <section className="flex min-h-[500px] min-w-0 flex-1 overflow-hidden rounded-xl border border-gray-200 p-4 dark:border-[#171D24] dark:bg-[#111111]">
          <CandleChart newsEvents={eventsData} />
        </section>
        <aside className="h-64 w-full flex-shrink-0 rounded-xl border border-gray-200 md:h-full md:max-h-screen md:w-[350px] dark:border-[#171D24]">
          <NewsEvents newsEvents={eventsData} />
        </aside>
      </div>
    </main>
  );
}
