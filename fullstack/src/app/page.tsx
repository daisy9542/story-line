"use client";

import { useEffect, useState } from "react";
import { okxHttp } from "@/http/server";
import { useKolStore } from "@/stores/kol-store";
import clsx from "clsx";
import {
  CandlestickChart as CandlestickChartIcon,
  ChevronRight,
} from "lucide-react";
import { parse } from "papaparse";

import type { ForceLink, ForceNode, GraphData } from "@/types/graph";
import type { KOL, SimpleKOL } from "@/types/kol";
import { Button } from "@/components/ui/button";
import CandlestickChart from "@/components/candlestick-chart";
import FilterCard from "@/components/cards/filter-card";
import KolInfo from "@/components/cards/kol-info";
import UserListCard from "@/components/cards/kol-list-card";
import ForceGraph from "@/components/graph/force-graph";
import Header from "@/components/layouts/header";

export default function IndexPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [sortedUsers, setSortedUsers] = useState<SimpleKOL[]>([]);
  const {
    selectedKolId,
    selectedTokenSymbol,
    leftCardsOpen,
    candlestickChartOpen,
    setLeftCardsOpen,
    setCandlestickChartOpen,
  } = useKolStore();

  useEffect(() => {
    fetch("/sample.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const result = parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const rows = result.data as any[];

        const nodesMap = new Map<string, ForceNode>();
        const links: ForceLink[] = [];
        const kolSet = new Set<KOL>();
        const kols: SimpleKOL[] = [];

        rows.forEach((row) => {
          const sourceId = row.author_id;
          const sourceName = row.username;
          const sourceFollowers = parseInt(row.followers || "0");

          const targetId = row.label;
          const targetFollowers = parseInt(row.label_followers || "0");

          if (!nodesMap.has(sourceId)) {
            nodesMap.set(sourceId, {
              id: sourceId,
              name: sourceName,
              followers: sourceFollowers,
            });
          }

          if (!kolSet.has(sourceId)) {
            kolSet.add(sourceId);
            kols.push({
              id: sourceId,
              username: sourceName,
              followers: sourceFollowers,
            });
          }
          if (!kolSet.has(targetId)) {
            kolSet.add(targetId);
            kols.push({
              id: targetId,
              username: targetId,
              followers: targetFollowers,
            });
          }

          if (row.object_type === "user" && !nodesMap.has(targetId)) {
            nodesMap.set(targetId, {
              id: targetId,
              name: targetId,
              followers: targetFollowers,
            });
          }

          links.push({
            source: sourceId,
            target: targetId,
            score: parseFloat(row.score_current_time || "0"),
          });
        });

        // 根据关注者数量排序节点，用于卡片展示
        // const users = Array.from(nodesMap.values());
        const sortedByFollowers = kols.sort(
          (a, b) => b.followers - a.followers,
        );
        setSortedUsers(sortedByFollowers);

        setGraphData({
          nodes: Array.from(nodesMap.values()),
          links,
        });
      });
  }, []);
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <div className="relative flex-1">
        {graphData && (
          <ForceGraph nodes={graphData.nodes} links={graphData.links} />
        )}

        {/* 左侧筛选与排名卡片 */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setLeftCardsOpen(!leftCardsOpen)}
            className={clsx(
              "absolute left-2 top-6 h-10 w-10 transition-transform duration-300 ease-in-out will-change-transform",
              leftCardsOpen ? "-ml-2 translate-x-[320px]" : "translate-x-0",
            )}
          >
            <ChevronRight />
          </Button>
          <div
            className={clsx(
              "transparent fixed bottom-16 left-0 top-16 flex h-[calc(100vh-64px)] flex-col space-y-4 overflow-hidden overflow-y-auto border-none transition-all duration-300 ease-in-out will-change-transform",
              leftCardsOpen ? "w-80 border-r p-4" : "w-0 p-0",
            )}
          >
            {leftCardsOpen && (
              <>
                <FilterCard kols={sortedUsers} />
                <UserListCard kols={sortedUsers} />
              </>
            )}
          </div>
        </div>

        {/* 右侧 KOL 信息卡片 */}
        <div className="transparent fixed bottom-16 right-0 top-16 flex h-[calc(100vh-64px)] w-80 flex-col space-y-4 overflow-hidden overflow-y-auto p-4 transition-transform duration-300 ease-in-out will-change-transform">
          {selectedKolId !== null ? <KolInfo kolId={selectedKolId} /> : null}
        </div>

        {/* 底部 K 线图 */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setCandlestickChartOpen(!candlestickChartOpen)}
            className={clsx(
              "fixed bottom-2 left-1/2 z-50 h-10 w-16 -translate-x-1/2 transition-transform duration-300 ease-in-out will-change-transform",
              candlestickChartOpen ? "-translate-y-[380px]" : "translate-y-0",
            )}
          >
            <CandlestickChartIcon />
          </Button>

          <div
            className={clsx(
              "transparent fixed bottom-0 left-1/2 h-96 w-[calc(100%-736px)] -translate-x-1/2 transform p-2 shadow-lg transition-transform duration-300 ease-in-out will-change-transform",
              candlestickChartOpen ? "translate-y-0" : "translate-y-full",
            )}
          >
            <CandlestickChart />
          </div>
        </div>
      </div>
    </div>
  );
}
