import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NewsEvent } from "@/types/news";
import { Separator } from "@/components/ui/separator";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ArrowLeft, Share2, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecursiveCausal } from "./recursive-causal";
import { useNewslineStore } from "@/stores/newsline-store";

export default function NewsEvents({ newsEvents }: { newsEvents: NewsEvent[] }) {
  const { focusedEventId, setFocusedEventId } = useNewslineStore();

  const selectedEvent = newsEvents.find((event) => event.event_id === focusedEventId);

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
        <span className="bg-gray-400 px-1 py-0.5 dark:bg-gray-700">{label}</span>
        <span className={`px-1 py-0.5 ${color}`}>{value}</span>
      </div>
    );
  };

  return (
    <div
      className="relative h-full w-full overflow-y-auto"
      ref={(el) => {
        if (focusedEventId && el) el.scrollTop = 0;
      }}
    >
      <AnimatePresence>
        <BentoGrid
          className={cn(
            "flex flex-col gap-3 overflow-auto p-4",
            `${focusedEventId ? "invisible" : ""}`,
          )}
        >
          {newsEvents.map((event) => (
            <BentoGridItem
              key={event.event_id}
              timestamp={event.event_timestamp * 1000}
              title={event.event_title}
              className="cursor-pointer py-2"
              onClick={() => setFocusedEventId(event.event_id)}
            ></BentoGridItem>
          ))}
        </BentoGrid>
        {focusedEventId && (
          <motion.div
            key={focusedEventId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-10 flex flex-col rounded-xl border border-none bg-white dark:bg-black"
          >
            <div className="flex h-10 items-center">
              <ArrowLeft
                className="ml-3 h-8 w-8 cursor-pointer rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-800/70"
                onClick={() => setFocusedEventId(null)}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-auto p-4 pt-0">
              <h2 className="text-xl font-bold">{selectedEvent?.event_title ?? "No title"}</h2>
              <p className="text-muted-foreground">
                {selectedEvent?.event_timestamp
                  ? new Date(selectedEvent.event_timestamp * 1000).toLocaleString()
                  : "Unknown time"}
              </p>
              <p>{selectedEvent?.summary ?? "No summary available."}</p>
              <Separator />
              <div className="flex items-center">
                <Share2 className="text-muted-foreground mr-1 h-5 w-5" />
                <p className="">Causal Analysis</p>
              </div>
              <div className="flex flex-col">
                {newsEvents
                  .find((event) => event.event_id === focusedEventId)
                  ?.causal_analysis.map((analysis) => (
                    <div
                      key={`${analysis.cause}-${analysis.trigger}`}
                      className="mb-4 rounded-lg border border-gray-200 p-4 transition-transform duration-150 hover:scale-[1.01] hover:shadow-lg dark:border-gray-800"
                    >
                      <RecursiveCausal analysis={analysis} isRoot={true} />
                    </div>
                  ))}
              </div>
              <Separator />
              <div className="flex items-center">
                <History className="text-muted-foreground mr-1 h-5 w-5" />
                <p className="">Historical Analogues</p>
              </div>
              <div className="flex-1">
                {newsEvents
                  .find((event) => event.event_id === focusedEventId)
                  ?.historical_analogues.map((analogue) => (
                    <div
                      key={
                        analogue.related_report_id ??
                        `${analogue.historical_case_summary}-${analogue.historical_event_date}`
                      }
                      className="border-gray flex w-full flex-col gap-1 rounded-md border px-3 py-2 dark:border-gray-800/80"
                    >
                      <p className="text-sm text-slate-400/80">{analogue.historical_event_date}</p>
                      <p className="font-semibold">{analogue.historical_case_summary}</p>
                      <div className="flex flex-wrap gap-2">
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
