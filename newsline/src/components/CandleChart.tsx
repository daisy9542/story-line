"use client";

import throttle from "lodash.throttle";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTheme } from "next-themes";
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
import { useNewslineStore } from "@/stores/newslineStore";
import { CandleData, CandleRequestParams } from "@/types/candle";
import { http } from "@/lib/axios";
import { cn } from "@/lib/utils";

export default function CandleChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const { resolvedTheme } = useTheme();
  const { selectedTokenSymbol } = useNewslineStore();
  const instId = useMemo(
    () => `${selectedTokenSymbol}-USDT`,
    [selectedTokenSymbol]
  );
  const isLoadingMoreRef = useRef<boolean>(false);
  const earliestRef = useRef<UTCTimestamp | null>(null);
  const candlesRef = useRef<CandleData[]>([]);
  const [bar, setBar] = useState("1D");
  const [loading, setLoading] = useState(false);

  const fetchCandles = (params: CandleRequestParams): Promise<CandleData[]> =>
    http.get("/candles", params) as Promise<CandleData[]>;

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

        return `${y}-${m}-${d}`;
      },
    },
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: 500,
    });
    chartRef.current = chart;
    seriesRef.current = chart.addSeries(CandlestickSeries);

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

    // const handleRange = throttle((logicalRange: IRange<number> | null) => {
    //   if (!logicalRange) return;
    //   const prev = candlesRef.current || [];

    //   // 左滑加载更多历史数据
    //   if (
    //     logicalRange.from <= 10 &&
    //     !isLoadingMoreRef.current &&
    //     earliestRef.current !== null
    //   ) {
    //     isLoadingMoreRef.current = true;
    //     const after = (earliestRef.current * 1000).toString();
    //     fetchCandles({ instId, bar, after })
    //       .then((more) => {
    //         // 过滤掉所有 time < minTimestampSec
    //         const combined = [...more, ...prev].sort((a, b) => a.time - b.time);
    //         if (more.length) {
    //           candlesRef.current = combined;
    //           seriesRef.current!.setData(combined);
    //           earliestRef.current = combined[0].time;
    //         } else {
    //           // 如果没有新数据，就不再请求
    //           earliestRef.current = null;
    //         }
    //       })
    //       .catch(() => {
    //         console.error("加载更多失败");
    //       })
    //       .finally(() => {
    //         isLoadingMoreRef.current = false;
    //       });
    //   }
    // }, 500);
    // chart.timeScale().subscribeVisibleLogicalRangeChange(handleRange);

    const series = seriesRef.current;
    let bounceTimer: NodeJS.Timeout | null = null;
    const handleRangeChange = (range: IRange<number> | null) => {
      if (!range || !series) return;

      const barsInfo = series.barsInLogicalRange(range);
      if (!barsInfo) return;

      const { barsBefore, barsAfter } = barsInfo;

      let shift = 0;
      if (barsBefore < 0) shift = -barsBefore;
      else if (barsAfter < 0) shift = barsAfter;
      if (shift !== 0) {
        // 立即拉回
        chart.timeScale().setVisibleLogicalRange({
          from: range.from + shift,
          to: range.to + shift,
        });
      }
    };

    chart.timeScale().subscribeVisibleLogicalRangeChange(handleRangeChange);

    return () => {
      // chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleRange);
      // handleRange.cancel();
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleRangeChange);
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
      const data = await fetchCandles({ instId, bar });
      data.sort((a, b) => a.time - b.time);
      candlesRef.current = data;
      seriesRef.current!.setData(data);
      earliestRef.current = data.length ? data[0].time : null;
      chartRef.current?.timeScale().fitContent();
    } catch (err) {
      console.error("加载初始数据失败:", err);
    } finally {
      setLoading(false);
    }
  }, [instId, bar]);

  useEffect(() => {
    if (!chartRef.current) return;
    loadInitial();
  }, [loadInitial]);

  return (
    <div className="w-full h-[500px] rounded-lg flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
      <div
        ref={chartContainerRef}
        className={cn("h-full w-full", loading && "opacity-20")}
      />
    </div>
  );
}
