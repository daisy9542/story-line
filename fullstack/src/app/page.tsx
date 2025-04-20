"use client";

import { useEffect, useState } from "react";
import { http } from "@/http/client";
import { useKolStore } from "@/stores/kol-store";
import {
  CandlestickChart as CandlestickChartIcon,
  ChevronRight,
} from "lucide-react";

import type {
  ForceLink,
  ForceNode,
  GraphData,
  KolGraphRow,
} from "@/types/graph";
import type { SimpleKOL } from "@/types/kol";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CandlestickChart,
  FilterCard,
  KolInfo,
  KolListCard,
} from "@/components/cards/index";
import ForceGraph from "@/components/graph/force-graph";
import Header from "@/components/layouts/header";

export default function IndexPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [sortedUsers, setSortedUsers] = useState<SimpleKOL[]>([]);
  const {
    selectedKol,
    leftCardsOpen,
    candlestickChartOpen,
    setLeftCardsOpen,
    setCandlestickChartOpen,
  } = useKolStore();

  useEffect(() => {
    http
      .get<KolGraphRow[]>("/user-graph") // 调用你已经连通的接口
      .then((rows) => {
        const nodesMap = new Map<string, ForceNode>();
        const links: ForceLink[] = [];
        const kolSet = new Set<string>();
        const kols: SimpleKOL[] = [];

        rows.forEach((row: KolGraphRow) => {
          const sourceId = row.author_id;
          const sourceName = row.name;
          const sourceUsername = row.username;
          const sourceFollowers = row.followers;

          const targetId = row.label_user_id;
          const targetFollowers = row.label_followers;

          // 创建 source 节点
          if (!nodesMap.has(sourceId)) {
            nodesMap.set(sourceId, {
              id: sourceId,
              name: sourceName,
              username: sourceUsername,
              followers: sourceFollowers,
            });
          }

          // 创建 target 节点
          if (row.object_type === "user" && !nodesMap.has(targetId)) {
            nodesMap.set(targetId, {
              id: targetId,
              name: row.label_name,
              username: row.label_username,
              followers: targetFollowers,
            });
          }

          // 收集 kols
          if (!kolSet.has(sourceId)) {
            kolSet.add(sourceId);
            kols.push({
              id: sourceId,
              name: sourceName,
              username: sourceUsername,
              followers: sourceFollowers,
            });
          }

          if (!kolSet.has(targetId)) {
            kolSet.add(targetId);
            kols.push({
              id: targetId,
              name: row.label_name,
              username: row.label_username,
              followers: targetFollowers,
            });
          }

          // 创建 link
          links.push({
            source: sourceId,
            target: targetId,
            score: row.score,
          });
        });

        const sortedByFollowers = kols.sort(
          (a, b) => b.followers - a.followers,
        );

        setSortedUsers(sortedByFollowers);
        setGraphData({
          nodes: Array.from(nodesMap.values()),
          links,
        });
      })
      .catch((err) => {
        console.error("获取图谱数据失败:", err);
      });
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Header />

      <div className="relative flex-1">
        {graphData && (
          <ForceGraph
            key="graph"
            nodes={graphData.nodes}
            links={graphData.links}
          />
        )}

        {/* 左侧筛选与排名卡片 */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setLeftCardsOpen(!leftCardsOpen)}
            className={cn(
              "absolute left-2 top-6 h-10 w-10 transition-transform duration-300 ease-in-out will-change-transform",
              leftCardsOpen
                ? "-ml-2 translate-x-[320px]"
                : "translate-x-0",
            )}
          >
            <ChevronRight />
          </Button>
          <div
            className={cn(
              "transparent fixed bottom-16 left-0 top-16 flex h-[calc(100vh-64px)] flex-col space-y-4 overflow-hidden overflow-y-auto border-none transition-all duration-300 ease-in-out will-change-transform",
              leftCardsOpen ? "w-80 border-r p-4" : "w-0 p-0",
            )}
          >
            {leftCardsOpen && (
              <>
                <FilterCard kols={sortedUsers} />
                <KolListCard kols={sortedUsers} />
              </>
            )}
          </div>
        </div>

        {/* 右侧 KOL 信息卡片 */}
        <div className="transparent fixed bottom-16 right-0 top-16 flex h-[calc(100vh-64px)] w-80 flex-col space-y-4 overflow-hidden overflow-y-auto p-4 transition-transform duration-300 ease-in-out will-change-transform">
          {selectedKol !== null ? <KolInfo /> : null}
        </div>

        {/* 底部 K 线图 */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setCandlestickChartOpen(!candlestickChartOpen)}
            className={cn(
              "fixed bottom-2 left-1/2 z-50 h-10 w-16 -translate-x-1/2 transition-transform duration-300 ease-in-out will-change-transform",
              candlestickChartOpen ? "-translate-y-[380px]" : "translate-y-0",
            )}
          >
            <CandlestickChartIcon />
          </Button>

          <div
            className={cn(
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
