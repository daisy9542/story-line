"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useKolStore } from "@/stores/kol-store";
import {
  CandlestickSeries,
  createChart,
  UTCTimestamp,
} from "lightweight-charts";
import { useTheme } from "next-themes";

import type { CandleData, RawCandleData } from "@/types/candlestick";
import { cn } from "@/lib/utils";
import { useCandleQuery } from "@/hooks/use-candle-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function CandlestickChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { selectedTokenSymbol } = useKolStore();
  const [bar, setBar] = useState("1H");
  const { resolvedTheme } = useTheme();

  const barMap = [
    { label: "1 minute", value: "1m" },
    { label: "1 hour", value: "1H" },
    { label: "1 day", value: "1D" },
    { label: "1 week", value: "1W" },
    { label: "1 month", value: "1M" },
  ];

  const LoadingOverlay = () => (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
    </div>
  );

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useCandleQuery({
    instId: `${selectedTokenSymbol}-USDT`,
    bar,
  });

  const transformToCandles = (data: RawCandleData[]): CandleData[] => {
    return data
      .map((item) => ({
        time: Math.floor(Number(item[0]) / 1000) as UTCTimestamp,
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        volume: parseFloat(item[5]),
        volumeBase: parseFloat(item[6]),
        volumeQuote: parseFloat(item[7]),
        confirm: item[8] === "1",
      }))
      .reverse();
  };

  const candleData = useMemo(() => transformToCandles(data), [data]);

  useEffect(() => {
    if (!chartRef.current || !candleData.length) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: chartRef.current.clientHeight,
      layout: {
        background: {
          color: resolvedTheme === "dark" ? "#111" : "#fff",
        },
        textColor: resolvedTheme === "dark" ? "#DDD" : "#333",
      },
      grid: {
        vertLines: {
          color: resolvedTheme === "dark" ? "#333" : "#EEE",
        },
        horzLines: {
          color: resolvedTheme === "dark" ? "#333" : "#EEE",
        },
      },
    });

    const series = chart.addSeries(CandlestickSeries);
    series.setData(candleData);

    return () => chart.remove();
  }, [data, resolvedTheme]);

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="relative flex-grow py-2">
        {isLoading && <LoadingOverlay />}
        <div
          ref={chartRef}
          className={cn(
            "h-full w-full",
            isLoading && "pointer-events-none opacity-20",
          )}
        />
      </CardContent>
      <CardFooter className="flex h-16 w-full items-center justify-center p-0 pb-2">
        <ToggleGroup
          type="single"
          value={bar}
          onValueChange={(value) => value && setBar(value)}
          className="rounded-full px-2 py-1"
        >
          {barMap.map((item) => (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              className={cn(
                "rounded-full px-4 py-1 text-xs text-muted-foreground transition",
                "data-[state=on]:bg-[#1f1f1f] data-[state=on]:text-white dark:data-[state=on]:bg-[#333] dark:data-[state=on]:text-white",
              )}
            >
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardFooter>
    </Card>
  );
}
