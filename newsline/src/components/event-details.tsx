import React from "react";
import { CausalInference, EventTimelineItem, Citation, KeyEntity, HistoricalComparison } from "@/types/report";
import { Puzzle, TrendingUpDown, Layers2, CalendarDays, Clock, ArrowUp, ArrowDown, ExternalLink, Calendar, FileText } from "lucide-react";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { motion } from "motion/react";

// 因果分析组件
interface CausalAnalysisProps {
  analysis: CausalInference;
  isRoot?: boolean;
}

export const CausalAnalysis = ({ analysis, isRoot = false }: CausalAnalysisProps) => {
  return (
    <div>
      <div className="flex items-center mb-3">
        {isRoot ? (
          <div className="inline-flex items-center bg-blue-200 dark:bg-blue-100 text-sm text-blue-700 px-2 py-1 rounded-xl mr-1 w-[90px]">
            <Puzzle className="h-4 w-4 mr-1" />
            CAUSE
          </div>
        ) : (
          <div className="inline-flex items-center bg-purple-200 dark:bg-purple-100 text-sm text-blue-700 px-2 py-1 rounded-xl mr-1 w-[90px]">
            <Layers2 className="h-4 w-4 mr-1" />
            FACTOR
          </div>
        )}
        <p className="text-neutral-900/90 dark:text-neutral-100/90 font-medium">{analysis.cause}</p>
      </div>
      <div className="flex items-center justify-center mb-3 pl-6">
        <AnimatedArrow height={60} width={30} />
        <div className="flex-1 ml-3">
          <p className="line-clamp-2 overflow-hidden text-ellipsis text-neutral-700 dark:text-neutral-300 text-sm">
            {analysis.evidence}
          </p>
        </div>
      </div>
      {typeof analysis.effect === "string" ? (
        <div className="flex items-center">
          <div className="inline-flex items-center bg-green-200 dark:bg-green-100 text-sm text-green-700 px-2 py-1 rounded-xl mr-1 w-[90px]">
            <TrendingUpDown className="h-4 w-4 mr-1" />
            EFFECT
          </div>
          <p className="text-neutral-900/90 dark:text-neutral-100/90 font-medium">
            {analysis.effect}
          </p>
        </div>
      ) : (
        <CausalAnalysis analysis={analysis.effect} />
      )}
    </div>
  );
};

// 事件时间线组件
interface EventTimelineProps {
  timeline: EventTimelineItem[];
}

export function EventTimeline({ timeline }: EventTimelineProps) {
  // 按日期排序
  const sortedTimeline = [...timeline].sort((a, b) => {
    return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
  });

  return (
    <div className="flex flex-col space-y-4">
      {sortedTimeline.map((item, index) => (
        <div key={`timeline-${index}`} className="relative">
          {/* 连接线 */}
          {index < sortedTimeline.length - 1 && (
            <div className="absolute left-3.5 top-6 h-full w-0.5 bg-gray-300 dark:bg-gray-700" />
          )}

          <div className="flex items-start gap-3">
            {/* 时间点标记 */}
            <div className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${getImportanceColor(item.sentiment_score)}`}>
              <Clock className="h-3.5 w-3.5 text-white" />
            </div>

            {/* 内容 */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{item.title}</h3>
                {item.sentiment_score > 0.5 && (
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    积极
                  </span>
                )}
                {item.sentiment_score < -0.5 && (
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    消极
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{formatDate(item.event_date)}</span>
              </div>

              {/* 来源链接 */}
              {item.source_url && (
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>查看来源</span>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 引用来源组件
interface CitationListProps {
  citations: Citation[];
}

export function CitationList({ citations }: CitationListProps) {
  return (
    <div className="flex flex-col space-y-3">
      {citations.map((citation, index) => (
        <div
          key={`citation-${index}`}
          className="flex flex-col rounded-md border border-gray-200 p-3 transition-all hover:border-blue-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-blue-800"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium">
                {citation.title || "未命名来源"}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                {citation.source && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    <span>{citation.source}</span>
                  </div>
                )}

                {citation.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(citation.date)}</span>
                  </div>
                )}
              </div>
            </div>

            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-2 truncate text-xs text-gray-500 dark:text-gray-400">
            <span className="opacity-70">{citation.url}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 历史类比组件
interface HistoricalComparisonsProps {
  comparisons: HistoricalComparison[];
  eventId: string;
}

export function HistoricalComparisons({ comparisons, eventId }: HistoricalComparisonsProps) {
  return (
    <div className="flex flex-col gap-3">
      {comparisons.map((comparison, index) => (
        <div
          key={`historical-${eventId}-${index}`}
          className="border-gray flex w-full flex-col gap-2 rounded-md border p-3 dark:border-gray-800/80"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400/80">{comparison.event_date}</p>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {comparison.similarity_label}
            </span>
          </div>
          <p className="font-semibold">{comparison.event_summary}</p>

          {comparison.outcome_and_lessons && (
            <div className="mt-1 rounded-md bg-gray-50 p-2 text-sm dark:bg-gray-800/50">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">结果与教训:</p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{comparison.outcome_and_lessons}</p>
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

// 关键实体组件
interface KeyEntitiesProps {
  entities: KeyEntity[];
}

export function KeyEntities({ entities }: KeyEntitiesProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {entities.map((entity, index) => (
        <EntityTag
          key={`entity-${index}`}
          name={entity.name}
          type={entity.type}
          role={entity.role}
        />
      ))}
    </div>
  );
}

// 辅助组件和函数
const EntityTag = ({ name, type, role }: { name: string; type: string; role: string }) => {
  const getTypeColor = () => {
    switch (type.toLowerCase()) {
      case 'person': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'organization': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'cryptocurrency': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'project': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="flex flex-col rounded-md border border-gray-200 p-2 dark:border-gray-800">
      <div className="font-medium">{name}</div>
      <div className="mt-1 flex items-center gap-1">
        <span className={`rounded px-1.5 py-0.5 text-xs ${getTypeColor()}`}>
          {type}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {role}
        </span>
      </div>
    </div>
  );
};

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

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// 根据情感分数返回颜色
function getImportanceColor(score: number): string {
  if (score > 0.5) return "bg-green-500 dark:bg-green-600";
  if (score < -0.5) return "bg-red-500 dark:bg-red-600";
  if (score > 0.2) return "bg-blue-500 dark:bg-blue-600";
  if (score < -0.2) return "bg-orange-500 dark:bg-orange-600";
  return "bg-gray-400 dark:bg-gray-600";
}
