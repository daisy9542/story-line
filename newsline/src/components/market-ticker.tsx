"use client";

import { useEffect, useRef, useState } from "react";
import { INewsEvent } from "@/types/report";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface MarketTickerProps {
  selectedEvent?: INewsEvent | null;
}

export default function MarketTicker({ selectedEvent }: MarketTickerProps) {
  const tickerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayEvent, setDisplayEvent] = useState<INewsEvent | null>(null);

  // 处理事件切换的过渡效果
  useEffect(() => {
    if (selectedEvent?.id !== displayEvent?.id) {
      if (displayEvent && selectedEvent) {
        // 如果从一个事件切换到另一个事件，显示过渡效果
        setIsTransitioning(true);
        setTimeout(() => {
          setDisplayEvent(selectedEvent);
          setIsTransitioning(false);
        }, 300); // 300ms过渡时间
      } else {
        // 直接切换（从无到有，或从有到无）
        setDisplayEvent(selectedEvent || null);
      }
    }
  }, [selectedEvent, displayEvent]);

  // 格式化市场名称 - 与market-data.tsx保持一致
  const formatMarketName = (key: string): string => {
    const nameMap: Record<string, string> = {
      DJIA: "^DJI", // 道琼斯工业平均指数
      FTSE_100: "^FTSE", // 富时 100 指数
      Nikkei_225: "^N225", // 日经 225 指数
      "S&P_500": "^GSPC", // 标准普尔 500 指数
      DAX: "^GDAXI", // 德国 DAX 指数
      BTC_USD: "BTC-USD", // 比特币对美元
      SOL_USD: "SOL-USD", // Solana 对美元
      ETH_USD: "ETH-USD", // 以太坊对美元
    };
    return nameMap[key] || key.replace("_", " ");
  };

  // 格式化事件时间
  const formatEventTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // 生成市场数据项
  const generateMarketItems = () => {
    if (!displayEvent?.market_data?.market_daily_change) {
      // 简化的默认提示内容
      return [
        { name: "Click on event bubbles to see market impact", change: "", isPositive: true, isDefault: true },
      ];
    }

    const marketEntries = Object.entries(displayEvent.market_data.market_daily_change);

    return marketEntries.map(([key, data]) => ({
      name: formatMarketName(key),
      change: data.daily_change_pct,
      isPositive: !data.daily_change_pct.includes("-"),
      isDefault: false,
    }));
  };

  const marketItems = generateMarketItems();

  // 检查是否需要滚动
  useEffect(() => {
    const checkScrollNeed = () => {
      if (tickerRef.current && contentRef.current) {
        const containerWidth = tickerRef.current.offsetWidth;
        const contentWidth = contentRef.current.scrollWidth;
        const screenWidth = window.innerWidth;
        const threshold = screenWidth * 0.8;

        // 对于默认提示内容，不需要滚动
        const hasDefaultContent = marketItems.length === 1 && marketItems[0].isDefault;

        // 内容宽度超过容器宽度的80%时开始滚动，但默认内容除外
        const needsScroll = !hasDefaultContent && contentWidth > Math.min(containerWidth, threshold);

        console.log('Scroll check:', {
          containerWidth,
          contentWidth,
          threshold: Math.min(containerWidth, threshold),
          hasDefaultContent,
          needsScroll,
          marketItems: marketItems.length
        });
        setShouldScroll(needsScroll);
      }
    };

    // 延迟检测，确保DOM已渲染
    const timer = setTimeout(checkScrollNeed, 200);
    window.addEventListener('resize', checkScrollNeed);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollNeed);
    };
  }, [marketItems]);

  return (
    <div className="h-10 border-b border-gray-200 bg-white dark:border-[#171D24] dark:bg-[#111111]">
      <div className="flex h-full items-center">
        {/* 事件时间显示 */}
        {displayEvent && (
          <div className="flex items-center space-x-2 border-r border-gray-200 px-4 dark:border-[#171D24]">
            <Calendar className="h-3 w-3 text-gray-500 dark:text-gray-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {formatEventTime(displayEvent.event_timestamp)}
            </span>
          </div>
        )}

        {/* 滚动内容区域 */}
        <div
          ref={tickerRef}
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={contentRef}
            className={`flex items-center space-x-8 px-4 transition-opacity duration-300 ${
              shouldScroll && !isPaused ? 'animate-scroll' : ''
            } ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
            style={{
              animationDuration: shouldScroll ? '30s' : 'none',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'linear',
            }}
          >
            {marketItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                {item.isDefault ? (
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                    <div className={`flex items-center space-x-1 ${
                      item.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium">
                        {item.change}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* 如果需要滚动，重复内容以实现无缝循环 */}
            {shouldScroll && marketItems.map((item, index) => (
              <div key={`repeat-${index}`} className="flex items-center space-x-2 whitespace-nowrap">
                {item.isDefault ? (
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-500">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                    <div className={`flex items-center space-x-1 ${
                      item.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-xs font-medium">
                        {item.change}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
