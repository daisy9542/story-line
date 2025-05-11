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
    <main className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center justify-between px-4">
        <TokenSelector />
        <div className="flex gap-2">
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 gap-3 overflow-hidden p-4">
        <section className="overflow-hidden min-h-[500px] flex min-w-0 flex-1 p-4 rounded-xl border border-gray-200 dark:border-[#171D24] dark:bg-[#111111]">
          <CandleChart newsEvents={eventsData} />
        </section>
        <aside className="md:w-[350px] min-h-[500px] w-full flex-shrink-0 border rounded-xl border-gray-200 dark:border-[#171D24]">
          <NewsEvents newsEvents={eventsData} />
        </aside>
      </div>
    </main>
  );
}
