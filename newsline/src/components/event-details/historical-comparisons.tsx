import React from "react";
import { HistoricalComparison } from "@/types/report";
import { formatDate } from "@/lib/utils";

interface HistoricalComparisonsProps {
  comparisons: HistoricalComparison[];
  eventId: string;
}

const MarketTag = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  const color = value.includes("-") ? "bg-red-600" : "bg-green-600";

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full text-[10px] font-medium text-white shadow-sm">
      <span className="bg-gray-400 px-1 py-0.5 dark:bg-gray-700">{label}</span>
      <span className={`px-1 py-0.5 ${color}`}>{value}</span>
    </div>
  );
};

export function HistoricalComparisons({ comparisons, eventId }: HistoricalComparisonsProps) {
  return (
    <div className="flex flex-col gap-3">
      {comparisons.map((comparison, index) => (
        <div
          key={`historical-${eventId}-${index}`}
          className="border-gray flex w-full flex-col gap-2 rounded-md border p-3 dark:border-gray-800/80"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400/80">
              {comparison.event_date ? formatDate(comparison.event_date) : '未知日期'}
            </p>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {comparison.similarity_label}
            </span>
          </div>
          <p className="font-semibold">{comparison.event_summary}</p>

          {comparison.outcome_and_lessons && (
            <div className="mt-1 rounded-md bg-gray-50 p-2 text-sm dark:bg-gray-800/50">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                结果与教训:
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {comparison.outcome_and_lessons}
              </p>
            </div>
          )}

          <div className="mt-1 flex flex-wrap gap-2">
            {comparison.market_indicator &&
              Object.entries(comparison.market_indicator).map(([key, value], i) => (
                <MarketTag
                  key={`market-${eventId}-${index}-${i}`}
                  label={key}
                  value={value || ""}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
