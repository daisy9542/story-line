import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NewsEvent } from "@/types/news";
import { Separator } from "@/components/ui/separator";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ArrowLeft, Share2, History, TrendingUpDown, Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecursiveCausal } from "./recursive-causal";

export default function NewsEvents({ newsEvents }: { newsEvents: NewsEvent[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const MarketTag = ({
    label,
    value,
  }: {
    label: string;
    value: string;
    color?: "green" | "red" | "gray";
  }) => {
    const color = value.includes("-") ? "bg-red-600" : "bg-green-600";

    return (
      <div className="inline-flex items-center overflow-hidden rounded-full text-[10px] font-medium text-white shadow-sm">
        <span className="bg-gray-400 dark:bg-gray-700 px-1 py-0.5">{label}</span>
        <span className={`px-1 py-0.5 ${color}`}>{value}</span>
      </div>
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence>
        <BentoGrid
          className={cn(
            "flex flex-col gap-3 p-4 rounded-xl overflow-auto",
            `${expandedId ? "invisible" : ""}`,
          )}
        >
          {newsEvents.map((event) => (
            <BentoGridItem
              key={event.event_id}
              timestamp={event.event_timestamp}
              title={event.event_title}
              className="cursor-pointer py-2"
              onClick={() => setExpandedId(event.event_id)}
            ></BentoGridItem>
          ))}
        </BentoGrid>
        {expandedId && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-10 flex flex-col bg-white dark:bg-black rounded-xl"
          >
            <div className="h-10 flex items-center">
              <ArrowLeft className="ml-3 h-8 w-8 p-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/70" onClick={() => setExpandedId(null)} />
            </div>
            <div className="flex flex-col flex-1 gap-2 overflow-auto p-4 pt-0">
              <h2 className="text-xl font-bold">
                {newsEvents.find((event) => event.event_id === expandedId)?.event_title}
              </h2>
              <p className="text-muted-foreground">
                {new Date(
                  newsEvents.find((event) => event.event_id === expandedId)?.event_timestamp!,
                ).toLocaleString()}
              </p>
              <p>{newsEvents.find((event) => event.event_id === expandedId)?.summary}</p>
              <Separator />
              <div className="flex items-center">
                <Share2 className="h-5 w-5 text-muted-foreground mr-1" />
                <p className="">Causal Analysis</p>
              </div>
              <div className="flex flex-col">
                {newsEvents
                  .find((event) => event.event_id === expandedId)
                  ?.causal_analysis.map((analysis) => (
                    <div
                      key={`${analysis.cause}-${analysis.trigger}`}
                      className="p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:scale-[1.01] transition-transform duration-150"
                    >
                      <RecursiveCausal analysis={analysis} isRoot={true} />
                    </div>
                  ))}
              </div>
              <Separator />
              <div className="flex items-center">
                <History className="h-5 w-5 text-muted-foreground mr-1" />
                <p className="">Historical Analogues</p>
              </div>
              <div className="flex-1">
                {newsEvents
                  .find((event) => event.event_id === expandedId)
                  ?.historical_analogues.map((analogue) => (
                    <div
                      key={
                        analogue.related_report_id ??
                        `${analogue.historical_case_summary}-${analogue.historical_event_date}`
                      }
                      className="px-3 py-2 w-full border border-gray dark:border-gray-800/80 rounded-md flex flex-col gap-1"
                    >
                      <p className="text-sm text-slate-400/80">{analogue.historical_event_date}</p>
                      <p className="font-semibold">{analogue.historical_case_summary}</p>
                      <div className="flex gap-2 flex-wrap">
                        {analogue.market_indicator &&
                          Object.keys(analogue.market_indicator).map((key) => (
                            <MarketTag
                              key={key}
                              label={key}
                              value={
                                analogue.market_indicator![
                                  key as keyof typeof analogue.market_indicator
                                ] ?? ""
                              }
                            />
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
