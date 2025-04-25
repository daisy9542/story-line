"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { http } from "@/http/client";
import { useKolStore } from "@/stores/kol-store";
import {
  CandlestickSeries,
  createChart,
  createSeriesMarkers,
  IRange,
  ISeriesMarkersPluginApi,
  MouseEventParams,
  Time,
  UTCTimestamp,
  type ISeriesApi,
  type SeriesMarker,
} from "lightweight-charts";
import throttle from "lodash.throttle";
import { useTheme } from "next-themes";

import type { CandleData, CandleRequestParams } from "@/types/candlestick";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function CandlestickChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const seriesMarkersRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);

  const {
    selectedTokenSymbol,
    filterTime,
    needRefresh,
    setFilterTime,
    setNeedRefresh,
  } = useKolStore();
  const { resolvedTheme } = useTheme();

  const earliestRef = useRef<UTCTimestamp | null>(null);
  const latestRef = useRef<UTCTimestamp | null>(null);
  const candlesRef = useRef<CandleData[]>([]);
  const isLoadingMoreRef = useRef<boolean>(false); // 防止并发加载

  const instId = useMemo(
    () => `${selectedTokenSymbol}-USDT`,
    [selectedTokenSymbol],
  );

  const [bar, setBar] = useState("1H");
  const [loading, setLoading] = useState(false);

  const minTimestampSec = useMemo(() => 1275095205000 / 1000, []); // 离线数据的最小毫秒时间戳
  const maxTimestampSec = useMemo(() => 1743544033000 / 1000, []); // 离线数据的最大毫秒时间戳

  const fetchCandles = (params: CandleRequestParams): Promise<CandleData[]> =>
    http.get("/market/candles", params) as Promise<CandleData[]>;

  const chartOptions = {
    layout: {
      background: { color: resolvedTheme === "dark" ? "#111" : "#fff" },
      textColor: resolvedTheme === "dark" ? "#DDD" : "#333",
    },
    grid: {
      vertLines: { color: resolvedTheme === "dark" ? "#333" : "#EEE" },
      horzLines: { color: resolvedTheme === "dark" ? "#333" : "#EEE" },
    },
    localization: {
      timeFormatter: (time: UTCTimestamp) => {
        const date = new Date(time * 1000);
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const d = date.getDate().toString().padStart(2, "0");
        const h = date.getHours().toString().padStart(2, "0");
        const min = date.getMinutes().toString().padStart(2, "0");
        const s = date.getSeconds().toString().padStart(2, "0");

        return `${y}-${m}-${d} ${h}:${min}:${s}`;
      },
    },
  };

  const intervalMap: Record<string, string> = {
    "1H": "1 hour",
    "1D": "1 day",
    "1W": "1 week",
    "1M": "1 month",
  };

  // 清空并绘制新的 marker
  const updateMarker = (timeSec: UTCTimestamp) => {
    const seriesMarkers = seriesMarkersRef.current;
    if (!seriesMarkers || !candlesRef.current.length) return;

    // 清空所有 markers
    seriesMarkers.setMarkers([]);
    // 找到最近 candle
    const nearest = candlesRef.current.reduce((prev, curr) =>
      Math.abs(curr.time - timeSec) < Math.abs(prev.time - timeSec)
        ? curr
        : prev,
    );
    const marker: SeriesMarker<UTCTimestamp> = {
      time: nearest.time,
      position: "aboveBar",
      color: "#2196F3",
      shape: "arrowDown",
      text: "Here",
    };
    seriesMarkers.setMarkers([marker]);
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });
    chartRef.current = chart;
    seriesRef.current = chart.addSeries(CandlestickSeries);
    seriesMarkersRef.current = createSeriesMarkers(seriesRef.current, []);

    // 点击事件：只更新 marker & store，不重载数据
    const handleClick = (param: MouseEventParams) => {
      if (param.time) {
        updateMarker(param.time as UTCTimestamp);
        setFilterTime((param.time as UTCTimestamp) * 1000);
        setNeedRefresh(true);
      }
    };
    chart.subscribeClick(handleClick);

    const handleRange = throttle((logicalRange: IRange<number> | null) => {
      if (!logicalRange) return;
      const prev = candlesRef.current || [];
      const total = prev.length;

      // 左滑加载更多历史数据
      if (
        logicalRange.from <= 10 &&
        !isLoadingMoreRef.current &&
        earliestRef.current !== null
      ) {
        isLoadingMoreRef.current = true;
        const after = (earliestRef.current * 1000).toString();
        fetchCandles({ instId, bar, after })
          .then((more) => {
            // 过滤掉所有 time < minTimestampSec
            const filtered = more.filter((c) => c.time >= minTimestampSec);
            const combined = [...filtered, ...prev].sort(
              (a, b) => a.time - b.time,
            );
            if (filtered.length) {
              candlesRef.current = combined;
              seriesRef.current!.setData(combined);
              // 如果已经追到最小时间戳，就不再请求
              if (combined[0].time <= minTimestampSec) {
                earliestRef.current = null;
              } else {
                earliestRef.current = combined[0].time;
              }
            } else {
              // 如果没有新数据，就不再请求
              earliestRef.current = null;
            }
          })
          .catch(() => {
            console.error("加载更多失败");
          })
          .finally(() => {
            isLoadingMoreRef.current = false;
          });
      }

      // 右滑加载更多未来数据
      if (
        total - logicalRange.to <= 10 &&
        !isLoadingMoreRef.current &&
        latestRef.current !== null &&
        latestRef.current < maxTimestampSec
      ) {
        isLoadingMoreRef.current = true;
        const before = (latestRef.current * 1000).toString();
        fetchCandles({ instId, bar, before })
          .then((more) => {
            // 过滤上界
            const filtered = more.filter((c) => c.time <= maxTimestampSec);
            const combined = [...prev, ...filtered].sort(
              (a, b) => a.time - b.time,
            );

            if (combined.length) {
              latestRef.current =
                combined[combined.length - 1].time >= maxTimestampSec
                  ? null
                  : combined[combined.length - 1].time;
              earliestRef.current = combined[0].time;
            } else {
              latestRef.current = null;
            }

            candlesRef.current = combined;
            seriesRef.current!.setData(combined);
          })
          .catch(() => console.error("加载新数据失败"))
          .finally(() => {
            isLoadingMoreRef.current = false;
          });
      }
    }, 500);

    chart.timeScale().subscribeVisibleLogicalRangeChange(handleRange);

    // 监听窗口大小变化，调整图表大小
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        chart.applyOptions({
          width: e.contentRect.width,
          height: e.contentRect.height,
        });
      }
    });
    ro.observe(chartContainerRef.current);

    return () => {
      chart.unsubscribeClick(handleClick);
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleRange);
      handleRange.cancel();
      chart.remove();
      ro.disconnect();
    };
  }, []);

  // 监听主题变化，更新图表样式
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.applyOptions(chartOptions);
  }, [resolvedTheme]);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const after = Math.min(maxTimestampSec * 1000, filterTime).toString();
      const data = await fetchCandles({ instId, bar, after });
      data.sort((a, b) => a.time - b.time);
      candlesRef.current = data;
      seriesRef.current!.setData(data);
      earliestRef.current = data.length ? data[0].time : null;
      latestRef.current = data.length ? data[data.length - 1].time : null;

      if (filterTime) {
        updateMarker((filterTime / 1000) as UTCTimestamp);
      }
    } catch (err) {
      console.error("加载初始数据失败:", err);
    } finally {
      setLoading(false);
    }
  }, [instId, bar]);

  useEffect(() => {
    if (needRefresh) {
      setNeedRefresh(false);
    } else {
      loadInitial();
    }
  }, [filterTime]);

  useEffect(() => {
    if (!chartRef.current) return;
    loadInitial();
  }, [loadInitial]);

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="relative flex-grow py-2">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
        <div
          ref={chartContainerRef}
          className={cn("h-full w-full", loading && "opacity-20")}
        />
      </CardContent>
      <CardFooter className="flex h-16 w-full items-center justify-center p-0 pb-2">
        <ToggleGroup
          type="single"
          value={bar}
          onValueChange={(v) => v && setBar(v)}
          className="rounded-full px-2 py-1"
        >
          {Object.keys(intervalMap).map((k) => (
            <ToggleGroupItem
              key={k}
              value={k}
              className={cn(
                "w-20 rounded-full px-4 py-1 text-xs text-muted-foreground transition",
                "data-[state=on]:bg[#1f1f1f] dark:data-[state=on]:bg[#333] data-[state=on]:text-white dark:data-[state=on]:text-white",
              )}
            >
              {intervalMap[k]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardFooter>
    </Card>
  );
}
