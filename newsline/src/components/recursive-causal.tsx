import React from "react";
import { Puzzle, TrendingUpDown, Layers2 } from "lucide-react";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { CausalRelation } from "@/types/news";

interface RecursiveCausalProps {
  analysis: CausalRelation;
  isRoot?: boolean;
}

export const RecursiveCausal = ({ analysis, isRoot = false }: RecursiveCausalProps) => {
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
            {analysis.trigger}
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
        <RecursiveCausal analysis={analysis.effect} />
      )}
    </div>
  );
};
