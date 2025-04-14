"use client";

import { useState } from "react";

import FilterSidebar from "@/components/layouts/filter-sidebar";
import Header from "@/components/layouts/header";
import GraphView from "@/app/graph-view";

export default function IndexPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <GraphView />
        </div>
        <FilterSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
    </div>
  );
}
