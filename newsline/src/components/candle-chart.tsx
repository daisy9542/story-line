"use client";

import throttle from "lodash.throttle";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  CandlestickSeries,
  createChart,
  IRange,
  Time,
  UTCTimestamp,
  type ISeriesApi,
  BarData,
} from "lightweight-charts";
import { useNewslineStore } from "@/stores/newsline-store";
import { CandleData, CandleRequestParams } from "@/types/candle";
import { http } from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  createCircleMarkers,
  ICircleMarkersPluginApi,
} from "@/components/lwc-plugin-circle-marker/wrapper";
import { CircleMarker } from "./lwc-plugin-circle-marker/i-circle-markers";

export default function CandleChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const { resolvedTheme } = useTheme();
  const { selectedTokenSymbol, setTimeRange } = useNewslineStore();
  const instId = useMemo(() => `${selectedTokenSymbol}-USDT`, [selectedTokenSymbol]);
  const [bar, setBar] = useState("1D");
  const [loading, setLoading] = useState(false);

  const isLoadingMoreRef = useRef<boolean>(false);
  const earliestRef = useRef<UTCTimestamp | null>(null);
  const candlesRef = useRef<CandleData[]>([]);
  const circleMarkerRef = useRef<ICircleMarkersPluginApi<Time> | null>(null);
  const [info, setInfo] = useState<{ open: number; high: number; low: number; close: number }>({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  });

  const fetchCandles = (params: CandleRequestParams): Promise<CandleData[]> =>
    http.get("/candles", params) as Promise<CandleData[]>;

  function loadImg(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  function getMarkersFromCandles(candles: CandleData[]): CircleMarker<UTCTimestamp>[] {
    const threshold = 0.05; // 5%
    const markers: CircleMarker<UTCTimestamp>[] = [];

    candles.forEach((candle) => {
      const change = (candle.close - candle.open) / candle.open;
      // 随机丢弃百分之五十
      if (Math.random() < 0.5) {
        return;
      }
      if (Math.abs(change) >= threshold) {
        markers.push({
          time: candle.time as UTCTimestamp,
          position: "aboveBar",
          // img: await loadImg("/data/elonmusk.png"),
        });
        if (Math.random() > 0.8) {
          markers.push({
            time: candle.time as UTCTimestamp,
            position: "aboveBar",
          });
        }
      }
    });

    return markers;
    // return [];
  }

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
      height: chartContainerRef.current.clientHeight,
    });
    chartRef.current = chart;
    seriesRef.current = chart.addSeries(CandlestickSeries);
    circleMarkerRef.current = createCircleMarkers(seriesRef.current, []);

    // 监听鼠标移动（十字光标）来动态更新 OHLC
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time) return;
      // param.seriesPrices 是 Map<ISeriesApi, number|BarValue>
      const b = param.seriesData.get(series) as BarData;
      if (b && "open" in b) {
        setInfo({ open: b.open, high: b.high, low: b.low, close: b.close });
      }
    });

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
    const handleRangeChange = (range: IRange<number> | null) => {
      if (!range || !series) return;

      const barsInfo = series.barsInLogicalRange(range);
      if (!barsInfo) return;

      const { barsBefore, barsAfter } = barsInfo;
      const maxOvershoot = 50; // 允许用户左右滑动最多超出数据区逻辑单位

      let shift = 0;
      if (barsBefore < -maxOvershoot) shift = -(barsBefore + maxOvershoot);
      else if (barsAfter < -maxOvershoot) shift = barsAfter + maxOvershoot;
      if (shift !== 0) {
        // 立即拉回
        chart.timeScale().setVisibleLogicalRange({
          from: range.from + shift,
          to: range.to + shift,
        });
      }
    };

    const handleTimeRangeChange = (range: IRange<Time> | null) => {
      if (!range) return;
      setTimeRange(range.from as UTCTimestamp, range.to as UTCTimestamp);
    };

    chart.timeScale().subscribeVisibleLogicalRangeChange(handleRangeChange);
    chart.timeScale().subscribeVisibleTimeRangeChange(handleTimeRangeChange);

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
      if (data.length) {
        const last = data[data.length - 1];
        setInfo({ open: last.open, high: last.high, low: last.low, close: last.close });
      }
      candlesRef.current = data;
      seriesRef.current!.setData(data);
      earliestRef.current = data.length ? data[0].time : null;
      chartRef.current?.timeScale().fitContent();
      const markers = getMarkersFromCandles(data);
      circleMarkerRef.current && circleMarkerRef.current.setMarkers(markers);
    } catch (err) {
      console.error("加载初始数据失败:", err);
    } finally {
      setLoading(false);
    }
  }, [instId, bar]);

  const changePct = (((info.close - info.open) / info.open) * 100).toFixed(2);

  useEffect(() => {
    if (!chartRef.current) return;
    loadInitial();
  }, [loadInitial]);

  return (
    <div className="relative w-full h-full rounded-lg flex items-center justify-center">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
      <div className="absolute top-0 left-0 text-sm z-10">
        {Object.entries(info).map(([key, value]) => (
          <span key={key} className="mr-1.5">
            {key.charAt(0).toUpperCase()}{" "}
            <span className={+changePct >= 0 ? "text-green-400" : "text-red-400"}>
              {value.toFixed(4)}
            </span>
          </span>
        ))}
        <span className={+changePct >= 0 ? "text-green-400" : "text-red-400"}>
          {+changePct >= 0 ? `+${changePct}` : `${changePct}`}%
        </span>
      </div>

      <div ref={chartContainerRef} className={cn("h-full w-full", loading && "opacity-20")} />
    </div>
  );
}
