import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NewsEvent } from "@/types/report";
import { Separator } from "@/components/ui/separator";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ArrowLeft, Share2, History, FileText, Clock, Users, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecursiveCausal } from "./recursive-causal";
import { useNewslineStore } from "@/stores/newsline-store";
import { EventTimeline } from "./event-timeline";
import { CitationList } from "./citation-list";

export default function NewsEvents({ newsEvents }: { newsEvents: NewsEvent[] }) {
  const { focusedEventId, setFocusedEventId } = useNewslineStore();
  const [activeTab, setActiveTab] = useState<
    "causal" | "timeline" | "historical" | "citations" | "entities"
  >("causal");

  const selectedEvent = newsEvents.find((event) => String(event.id) === focusedEventId);

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

  const EntityTag = ({ name, type, role }: { name: string; type: string; role: string }) => {
    const getTypeColor = () => {
      switch (type.toLowerCase()) {
        case "person":
          return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
        case "organization":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        case "cryptocurrency":
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
        case "project":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      }
    };

    return (
      <div className="flex flex-col rounded-md border border-gray-200 p-2 dark:border-gray-800">
        <div className="font-medium">{name}</div>
        <div className="mt-1 flex items-center gap-1">
          <span className={`rounded px-1.5 py-0.5 text-xs ${getTypeColor()}`}>{type}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{role}</span>
        </div>
      </div>
    );
  };

  const TabButton = ({
    id,
    label,
    icon,
    active,
  }: {
    id: typeof activeTab;
    label: string;
    icon: React.ReactNode;
    active: boolean;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors",
        active
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/70",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

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
              key={String(event.id)}
              timestamp={event.event_timestamp * 1000}
              title={event.report_title}
              className="cursor-pointer py-2"
              onClick={() => setFocusedEventId(String(event.id))}
            ></BentoGridItem>
          ))}
        </BentoGrid>
        {focusedEventId && selectedEvent && (
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
              <h2 className="text-xl font-bold">{selectedEvent.report_title}</h2>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.event_categories.map((category, idx) => (
                  <span
                    key={`category-${idx}`}
                    className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {category.category_name}
                  </span>
                ))}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    selectedEvent.sentiment_label === "Positive"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : selectedEvent.sentiment_label === "Negative"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
                  )}
                >
                  {selectedEvent.sentiment_label}
                </span>
              </div>
              <p className="text-muted-foreground">
                {selectedEvent.event_timestamp
                  ? new Date(selectedEvent.event_timestamp * 1000).toLocaleString()
                  : "Unknown time"}
              </p>
              <p>{selectedEvent.executive_summary}</p>

              <Separator className="my-2" />

              {/* 选项卡导航 */}
              <div className="flex flex-wrap gap-2">
                <TabButton
                  id="causal"
                  label="因果分析"
                  icon={<Share2 className="h-4 w-4" />}
                  active={activeTab === "causal"}
                />
                {selectedEvent.event_timeline && selectedEvent.event_timeline.length > 0 && (
                  <TabButton
                    id="timeline"
                    label="事件时间线"
                    icon={<Clock className="h-4 w-4" />}
                    active={activeTab === "timeline"}
                  />
                )}
                <TabButton
                  id="historical"
                  label="历史类比"
                  icon={<History className="h-4 w-4" />}
                  active={activeTab === "historical"}
                />
                {selectedEvent.citations && selectedEvent.citations.length > 0 && (
                  <TabButton
                    id="citations"
                    label="引用来源"
                    icon={<FileText className="h-4 w-4" />}
                    active={activeTab === "citations"}
                  />
                )}
                {selectedEvent.key_entities && selectedEvent.key_entities.length > 0 && (
                  <TabButton
                    id="entities"
                    label="关键实体"
                    icon={<Users className="h-4 w-4" />}
                    active={activeTab === "entities"}
                  />
                )}
              </div>

              <div className="mt-2">
                {/* 因果分析 */}
                {activeTab === "causal" && selectedEvent.causal_inferences && (
                  <div className="flex flex-col gap-4">
                    {selectedEvent.causal_inferences.map((analysis, index) => (
                      <div key={`causal-${focusedEventId}-${index}`}>
                        <RecursiveCausal analysis={analysis} isRoot={true} />
                      </div>
                    ))}
                  </div>
                )}

                {/* 事件时间线 */}
                {activeTab === "timeline" && selectedEvent.event_timeline && (
                  <div className="mt-4">
                    <EventTimeline timeline={selectedEvent.event_timeline} />
                  </div>
                )}

                {/* 历史类比 */}
                {activeTab === "historical" && selectedEvent.historical_comparisons && (
                  <div className="flex flex-col gap-3">
                    {selectedEvent.historical_comparisons.map((comparison, index) => (
                      <div
                        key={`historical-${focusedEventId}-${index}`}
                        className="border-gray flex w-full flex-col gap-2 rounded-md border p-3 dark:border-gray-800/80"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-400/80">
                            {comparison.event_date || selectedEvent.analysis_date}
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
                                key={`market-${focusedEventId}-${index}-${i}`}
                                label={key}
                                value={value || ""}
                              />
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 引用来源 */}
                {activeTab === "citations" && selectedEvent.citations && (
                  <div className="mt-4">
                    <CitationList citations={selectedEvent.citations} />
                  </div>
                )}

                {/* 关键实体 */}
                {activeTab === "entities" && selectedEvent.key_entities && (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {selectedEvent.key_entities.map((entity, index) => (
                      <EntityTag
                        key={`entity-${index}`}
                        name={entity.name}
                        type={entity.type}
                        role={entity.role}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
