"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { http } from "@/http/client";
import { useKolStore } from "@/stores/kol-store";
import debounce from "lodash.debounce";
import {
  CandlestickChart as CandlestickChartIcon,
  ChevronRight,
  CircleMinus,
  CirclePlus,
} from "lucide-react";

import type { ForceGraphHandle, GraphData } from "@/types/graph";
import type { SimpleKOL } from "@/types/kol";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CandlestickChart,
  FilterCard,
  KolInfo,
  KolListCard,
} from "@/components/cards/index";
import { ThemeToggle } from "@/components/theme-toggle";
import TokenSelector from "@/components/token-selector";
import WelcomeOverlay from "@/components/welcome-overlay";

const ForceGraph = dynamic(() => import("@/components/graph/force-graph"), {
  ssr: false,
});

export default function IndexPage() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [sortedUsers, setSortedUsers] = useState<SimpleKOL[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320);
  const MIN_WIDTH = 240;
  const MAX_WIDTH = 600;

  const handleDrag = (e: MouseEvent) => {
    const newWidth = window.innerWidth - e.clientX;
    setPanelWidth(Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH)));
  };

  const startResize = () => {
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopResize);
  };

  const stopResize = () => {
    document.body.style.userSelect = "auto";
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopResize);
  };

  const {
    needRefresh,
    setNeedRefresh,
    selectedKol,
    selectedTokenSymbol,
    filterFollowers,
    filterTime,
    leftCardsOpen,
    candlestickChartOpen,
    setLeftCardsOpen,
    setCandlestickChartOpen,
    interestedKolIds,
    excludedKolIds,
    hydrated,
  } = useKolStore();

  const graphRef = useRef<ForceGraphHandle>(null);

  const handleZoomIn = () => {
    const currentZoom = graphRef.current?.zoom();
    if (currentZoom) graphRef.current?.zoom(currentZoom * 1.3, 400);
  };

  const handleZoomOut = () => {
    const currentZoom = graphRef.current?.zoom();
    if (currentZoom) graphRef.current?.zoom(currentZoom / 1.3, 400);
  };

  const getGraphData = useCallback(
    (cb?: () => void) => {
      if (!hydrated) return;
      setIsLoading(true);
      http
        .post<GraphData>("/graph", {
          token: selectedTokenSymbol,
          filter_followers: filterFollowers,
          filter_time: filterTime,
          add_user_list: interestedKolIds,
          sub_user_list: excludedKolIds,
        })
        .then((res) => {
          const { nodes, links } = res;
          const kols: SimpleKOL[] = [];

          nodes.forEach((node) => {
            kols.push({
              id: node.id,
              name: node.name,
              username: node.username,
              followers: node.followers,
            });
          });

          const sortedByFollowers = kols.sort(
            (a, b) => b.followers - a.followers,
          );

          setSortedUsers(sortedByFollowers);
          setGraphData({
            nodes,
            links,
          });
        })
        .catch((err) => {
          console.error("获取图谱数据失败:", err);
        })
        .finally(() => {
          setIsLoading(false);
          cb && cb();
        });
    },
    [hydrated],
  );

  const debouncedGetGraphData = useMemo(() => {
    return debounce(getGraphData, 500, { leading: true, trailing: true });
  }, [getGraphData]);

  useEffect(() => {
    return () => {
      debouncedGetGraphData.cancel();
    };
  }, [debouncedGetGraphData]);

  useEffect(() => {
    if (!hydrated) return;
    debouncedGetGraphData();
    return () => {
      debouncedGetGraphData.cancel();
    };
  }, [hydrated, debouncedGetGraphData]);

  useEffect(() => {
    if (!needRefresh) return;
    debouncedGetGraphData(() => {
      setNeedRefresh(false);
    });
  }, [needRefresh, debouncedGetGraphData, setNeedRefresh]);

  return (
    <div className="flex h-screen flex-col">
      <header className="relative flex h-16 items-center justify-between px-4 py-2">
        <TokenSelector />
        <div className="flex gap-2">
          <WelcomeOverlay />
          <ThemeToggle />
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden">
        {graphData && (
          <ForceGraph
            ref={graphRef}
            key="graph"
            nodes={graphData.nodes}
            links={graphData.links}
          />
        )}

        {/* 左侧筛选与排名卡片 */}
        <div className="relative z-50">
          <div
            className={cn(
              "fixed left-0 top-24 z-50 flex flex-col gap-1 transition-transform duration-300 ease-in-out will-change-transform",
              leftCardsOpen ? "translate-x-[316px]" : "translate-x-[12px]",
            )}
          >
            <Button
              variant="outline"
              onClick={() => setLeftCardsOpen(!leftCardsOpen)}
              className="h-12 w-12"
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="h-12 w-12"
              onClick={() => handleZoomIn()}
            >
              <CirclePlus />
            </Button>
            <Button
              variant="outline"
              className="h-12 w-12"
              onClick={() => handleZoomOut()}
            >
              <CircleMinus />
            </Button>
          </div>
          <div
            className={cn(
              "transparent fixed bottom-16 left-0 top-16 flex h-[calc(100vh-64px)] flex-col space-y-4 overflow-hidden border-none transition-all duration-300 ease-in-out will-change-transform",
              leftCardsOpen ? "w-80 border-r p-4" : "w-0 p-0",
            )}
          >
            {leftCardsOpen && (
              <>
                <FilterCard
                  kols={sortedUsers}
                  isLoading={isLoading}
                  onFilterChange={() => getGraphData()}
                />
                <div className="flex-1 overflow-hidden">
                  <KolListCard kols={sortedUsers} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 右侧 KOL 信息卡片 */}
        <div
          className={cn(
            "fixed bottom-16 right-0 top-16 z-50 flex h-[calc(100vh-64px)] flex-col space-y-4 overflow-hidden overflow-y-auto border-l bg-background p-4 transition-transform duration-300 ease-in-out will-change-transform",
            selectedKol ? "" : "hidden",
          )}
          style={{ width: `${panelWidth}px` }}
        >
          <KolInfo />
          <div
            onMouseDown={startResize}
            className="group absolute left-0 top-0 h-full w-2 cursor-ew-resize bg-transparent hover:bg-transparent"
          >
            <div className="absolute left-1/2 top-1/2 h-12 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground opacity-50" />
          </div>
        </div>

        {/* 底部 K 线图 */}
        <div className="relative z-50">
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
            {candlestickChartOpen ? <CandlestickChart /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
