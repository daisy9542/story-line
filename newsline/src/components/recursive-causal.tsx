import React from "react";
import { CausalInference } from "@/types/report";
import { ArrowDown } from "lucide-react";

interface RecursiveCausalProps {
  analysis: CausalInference;
  isRoot?: boolean;
  level?: number;
}

export function RecursiveCausal({ analysis, isRoot = false, level = 0 }: RecursiveCausalProps) {
  const maxLevel = 3; // 最大递归层级
  const isLastLevel = level >= maxLevel;

  // 检查是否有嵌套的因果关系
  const hasNestedEffect = typeof analysis.effect === "object";

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isRoot
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            原因
          </span>
          <span className="font-medium">{analysis.cause}</span>
        </div>

        <div className="ml-4 flex items-center gap-2">
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            触发
          </span>
          <span>{analysis.evidence}</span>
          {analysis.confidence && (
            <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              置信度: {Math.round(analysis.confidence * 100)}%
            </span>
          )}
        </div>

        <div className="ml-8 flex items-center gap-2">
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
            结果
          </span>
          {!hasNestedEffect ? (
            <span>{analysis.effect as string}</span>
          ) : (
            <ArrowDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* 递归渲染嵌套的因果关系 */}
      {hasNestedEffect && !isLastLevel && (
        <div className="mt-2 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
          <RecursiveCausal
            analysis={analysis.effect as CausalInference}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
}
