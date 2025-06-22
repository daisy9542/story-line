import React from "react";
import { Citation } from "@/types/report";
import { ExternalLink, Calendar, FileText } from "lucide-react";

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

// 格式化日期
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
