"use client";

import { useMemo } from "react";
import { TokenSymbol } from "@/types/newsline";

interface TradingData {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp?: number;
}

interface TradingInfoHeaderProps {
  symbol: TokenSymbol;
  data: TradingData;
  loading?: boolean;
}

export default function TradingInfoHeader({
  symbol,
  data,
  loading = false
}: TradingInfoHeaderProps) {
  const { priceChange, priceChangePercent, isPositive } = useMemo(() => {
    const change = data.close - data.open;
    const changePercent = data.open > 0 ? (change / data.open) * 100 : 0;
    return {
      priceChange: change,
      priceChangePercent: changePercent,
      isPositive: change >= 0,
    };
  }, [data.open, data.close]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  if (loading) {
    return (
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-[#171D24] dark:bg-[#111111]">
        <div className="flex items-center space-x-3 md:space-x-6">
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200 md:w-24 dark:bg-gray-700" />
          <div className="hidden h-5 w-16 animate-pulse rounded bg-gray-200 lg:block dark:bg-gray-700" />
        </div>
        <div className="hidden h-4 w-12 animate-pulse rounded bg-gray-200 sm:block dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-[#171D24] dark:bg-[#111111]">
      <div className="flex items-center space-x-3 md:space-x-6">
        {/* Token Symbol */}
        <div className="flex items-center space-x-2">
          <h1 className="text-base font-semibold text-gray-900 md:text-lg dark:text-white">
            {symbol}/USDT
          </h1>
        </div>

        {/* Current Price and Change */}
        <div className="flex items-baseline space-x-2">
          <span className={`text-lg font-semibold md:text-xl ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            ${formatPrice(data.close)}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1">
            <span className="text-xs font-medium sm:text-sm text-gray-500 dark:text-gray-400">
              {isPositive ? '+' : ''}{formatPrice(priceChange)}
            </span>
            <span className={`text-xs font-medium sm:text-sm ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              <span className="hidden sm:inline">(</span>{isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%<span className="hidden sm:inline">)</span>
            </span>
          </div>
        </div>

        {/* OHLC Data - Hidden on small screens */}
        <div className="hidden items-center space-x-3 text-xs lg:flex lg:space-x-4">
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400">24h High</span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              ${formatPrice(data.high)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400">24h Low</span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              ${formatPrice(data.low)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 dark:text-gray-400">Open</span>
            <span className="font-medium text-gray-900 dark:text-gray-200">
              ${formatPrice(data.open)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
