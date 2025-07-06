"use client";

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

import { INewsEvent } from "@/types/report";

export default function CandleChart({ newsEvents }: { newsEvents: INewsEvent[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const { resolvedTheme } = useTheme();
  const { selectedTokenSymbol, setTimeRange, setFocusedEventId } = useNewslineStore();
  const instId = useMemo(() => `${selectedTokenSymbol}-USDT`, [selectedTokenSymbol]);
  const [bar] = useState("1D");
  const [loading, setLoading] = useState(false);
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const earliestRef = useRef<UTCTimestamp | null>(null);
  const candlesRef = useRef<CandleData[]>([]);
  const circleMarkerRef = useRef<ICircleMarkersPluginApi<Time> | null>(null);

  const [info, setInfo] = useState<{ open: number; high: number; low: number; close: number }>({
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  });
  const [, setFocusedEventTime] = useState<UTCTimestamp | null>(null);

  const fetchCandles = (params: CandleRequestParams): Promise<CandleData[]> =>
    http.get("/candles", params) as Promise<CandleData[]>;

  const drawMarkers = useCallback((): void => {
    const markers: CircleMarker<UTCTimestamp>[] = [];

    newsEvents.forEach((event) => {
      // 确保时间戳存在且有效
      if (event.event_timestamp && !isNaN(event.event_timestamp)) {
        markers.push({
          id: String(event.id),
          time: event.event_timestamp as UTCTimestamp,
          text: event.report_title,
          position: "aboveBar",
          hovered: hoveredEventId === String(event.id),
          // 传递权重信息用于聚合时选择代表性事件
          influence: event.event_influence || 50,
          // 传递图标信息
          icon: event.icon,
        });
      }
    });

    if (markers.length > 0 && circleMarkerRef.current) {
      circleMarkerRef.current.setMarkers(markers);
    }
  }, [newsEvents, hoveredEventId]);

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
      const b = param.seriesData.get(seriesRef.current!) as BarData;
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

    // 事件泡泡 hover 逻辑
    chart.subscribeCrosshairMove((param) => {
      // 如果 point 不存在，说明移出了图表区域
      if (!param.point) {
        setHoveredEventId(null);
        return;
      }

      const hoveredId = param.hoveredObjectId as string;
      setHoveredEventId(hoveredId);
    });

    // 事件泡泡 click 逻辑
    chart.subscribeClick((param) => {
      if (!param.point) {
        return;
      }

      const clickedId = param.hoveredObjectId as string;
      setFocusedEventId(clickedId);

      // 设置标记的聚焦状态
      if (circleMarkerRef.current && typeof circleMarkerRef.current.getPrimitive === "function") {
        try {
          const primitive = circleMarkerRef.current.getPrimitive();
          const paneView = primitive?.getPaneView();
          if (paneView) {
            paneView.setFocusedMarkerId(clickedId);
          }
        } catch (error) {
          console.error("设置聚焦状态失败:", error);
        }
      }

      // 设置聚焦事件时间
      if (clickedId) {
        const event = newsEvents.find((e) => String(e.id) === clickedId);
        if (event) {
          // 使用 event_timestamp 而不是 start_date
          const eventTime = event.event_timestamp;
          setFocusedEventTime(eventTime as UTCTimestamp);
        }
      }
    });

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

    chart.timeScale().subscribeVisibleLogicalRangeChange(handleRangeChange);

    return () => {
      // chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleRange);
      // handleRange.cancel();
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleRangeChange);
      chart.remove();
      ro.disconnect();
    };
  }, []);

  const handleTimeRangeChange = (range: IRange<Time> | null) => {
    if (!range) return;
    setTimeRange(range.from as UTCTimestamp, range.to as UTCTimestamp);
  };

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
      chartRef.current?.timeScale().subscribeVisibleTimeRangeChange(handleTimeRangeChange);
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

  useEffect(() => {
    drawMarkers();
  }, [newsEvents, hoveredEventId]);

  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-lg">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
      <div className="absolute top-0 left-0 z-10 text-sm">
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
