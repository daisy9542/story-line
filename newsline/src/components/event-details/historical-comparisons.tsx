import React, { useState } from "react";
import { HistoricalComparison } from "@/types/report";
import { formatDate, getSentimentColor } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface HistoricalComparisonsProps {
  comparisons: HistoricalComparison[];
  eventId: string;
}

const MarketTag = ({ label, value }: { label: string; value: string }) => {
  const color = value.includes("-") ? "bg-red-600" : "bg-green-600";

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full text-[10px] font-medium text-white shadow-sm">
      <span className="bg-gray-400 px-1 py-0.5 dark:bg-gray-700">{label}</span>
      <span className={`px-1 py-0.5 ${color}`}>{value}</span>
    </div>
  );
};

export function HistoricalComparisons({ comparisons, eventId }: HistoricalComparisonsProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="flex flex-col gap-3">
      {comparisons.map((comparison, index) => {
        const isExpanded = expandedItems.has(index);

        return (
          <div
            key={`historical-${eventId}-${index}`}
            className="flex w-full flex-col gap-2 rounded-md border border-gray-200 p-3 dark:border-gray-800/80"
          >
            {/* 头部信息 */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-400/80">
                {comparison.event_date ? formatDate(comparison.event_date) : "未知日期"}
              </p>
              {/* 情感分数圆点 */}
              <div
                className={`h-2 w-2 rounded-full ${getSentimentColor(comparison.sentiment_score, "bg")}`}
              />
            </div>

            {/* 事件摘要 */}
            <p className="font-semibold">{comparison.event_summary}</p>

            {/* 相似标签 */}
            <div className="flex justify-start">
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {comparison.similarity_label}
              </span>
            </div>

            {/* 市场指标标签 */}
            <div className="flex flex-wrap gap-2">
              {comparison.market_indicator &&
                Object.entries(comparison.market_indicator).map(([key, value], i) => (
                  <MarketTag
                    key={`market-${eventId}-${index}-${i}`}
                    label={key}
                    value={value || ""}
                  />
                ))}
            </div>

            {/* 可展开的结果与教训 */}
            {comparison.outcome_and_lessons && (
              <div>
                <button
                  onClick={() => toggleExpanded(index)}
                  className="flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span>Outcome & Lessons</span>
                </button>

                {isExpanded && (
                  <div className="mt-2 rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-800/50">
                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                      {comparison.outcome_and_lessons}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
