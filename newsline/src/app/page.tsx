"use client";

import CandleChart from "@/components/CandleChart";
import TimelineEvents from "@/components/TimelineEvents";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <section className="flex-1 p-4">
        <CandleChart />
      </section>
      <section className="h-[300px] border-t border-gray-200 bg-white p-4 overflow-y-auto">
        <TimelineEvents />
      </section>
    </main>
  );
}
