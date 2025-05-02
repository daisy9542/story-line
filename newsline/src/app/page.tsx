"use client";

import CandleChart from "@/components/CandleChart";
import { ThemeToggle } from "@/components/ThemeToggle";
import TimelineEvents from "@/components/TimelineEvents";
import TokenSelector from "@/components/TokenSelector";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="relative flex h-16 items-center justify-between px-4 py-2">
        <TokenSelector />
        <div className="flex gap-2">
          <ThemeToggle />
        </div>
      </header>
      <section className="flex-1 p-4">
        <CandleChart />
      </section>
      <section className="h-[300px] border-t border-gray-200 bg-white p-4 overflow-y-auto">
        <TimelineEvents />
      </section>
    </main>
  );
}
