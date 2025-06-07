"use client";

import { useEffect, useState } from "react";
import GraphContainer from "@/components/graph/graph-container";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import AnalysisContainer from "@/components/sidebar-list/analysis-container";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/graph");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-blue-500 mx-auto"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error || "Failed to load data"}</p>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen flex-1 flex-col">
      <Header />

      <main className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex h-full w-full flex-1 items-start">
          <div className="h-full w-[314px]">
            <Sidebar />
          </div>
          <section className="relative z-20 h-full flex-1">
            <GraphContainer graphData={data.graphData} />
            <div className="absolute top-6 right-6 h-[500px] w-[320px] shadow-lg z-100">
              <AnalysisContainer
                eventTitle={data.eventTitle}
                analysisData={data.analysisData}
                eventLines={data.eventLines}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
