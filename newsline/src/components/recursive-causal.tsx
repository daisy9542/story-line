import React, { useState, useRef, useEffect } from "react";
import { Puzzle, TrendingUpDown, Layers2, ExternalLink, AlertTriangle } from "lucide-react";
import { AnimatedArrow } from "@/components/ui/animated-arrow";
import { CausalInference } from "@/types/report";

interface RecursiveCausalProps {
  analysis: CausalInference;
  isRoot?: boolean;
}

// 获取置信度颜色和文本
const getConfidenceStyle = (confidence: number) => {
  if (confidence >= 0.8) return { color: "text-green-600", bg: "bg-green-50", text: "高" };
  if (confidence >= 0.6) return { color: "text-yellow-600", bg: "bg-yellow-50", text: "中" };
  return { color: "text-red-600", bg: "bg-red-50", text: "低" };
};

// 获取情感分数的颜色
const getSentimentColor = (score: number) => {
  if (score > 0.3) return "text-green-500";
  if (score < -0.3) return "text-red-500";
  return "text-gray-500";
};

export const RecursiveCausal = ({ analysis, isRoot = false }: RecursiveCausalProps) => {
  const confidenceStyle = getConfidenceStyle(analysis.confidence || 0);
  const sentimentColor = getSentimentColor(analysis.sentiment_score || 0);

  // 用于计算文本高度
  const [textHeight, setTextHeight] = useState(60);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      // 检查文本是否被截断
      setIsTextTruncated(element.scrollHeight > element.clientHeight);
      // 动态设置箭头高度，最小30px，最大120px
      // const calculatedHeight = Math.min(Math.max(element.scrollHeight, 30), 120);
      setTextHeight(element.scrollHeight);
    }
  }, [analysis.evidence]);

  return (
    <div className="relative rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      {/* 置信度指示器 - 右上角贴边 */}
      <div className="absolute -top-px -right-px">
        <div
          className={`inline-flex items-center rounded-tr-lg rounded-bl-lg px-3 py-1 text-xs font-medium ${confidenceStyle.bg} ${confidenceStyle.color}`}
        >
          <span className="mr-1">可信度{confidenceStyle.text}</span>
        </div>
      </div>

      <div className="my-3 flex items-center">
        {isRoot ? (
          <div className="mr-1 inline-flex w-[90px] items-center rounded-xl bg-blue-200 px-2 py-1 text-sm text-blue-700 dark:bg-blue-100">
            <Puzzle className="mr-1 h-4 w-4" />
            CAUSE
          </div>
        ) : (
          <div className="mr-1 inline-flex w-[90px] items-center rounded-xl bg-purple-200 px-2 py-1 text-sm text-blue-700 dark:bg-purple-100">
            <Layers2 className="mr-1 h-4 w-4" />
            FACTOR
          </div>
        )}
        <div className="flex-1">
          <p className="text-neutral-900/90 dark:text-neutral-100/90">{analysis.cause}</p>
          {/* 来源链接 */}
          {analysis.source_url && (
            <a
              href={analysis.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              查看来源
            </a>
          )}
        </div>
      </div>

      <div className="mb-3 flex items-start justify-center pl-6">
        <AnimatedArrow height={textHeight} width={30} />
        <div className={`ml-3 flex-1 h-[${textHeight}px]`}>
          <div className="flex items-center justify-between">
            <div className="group relative flex flex-1 items-center">
              <p
                ref={textRef}
                className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-400"
                style={{ maxHeight: `${textHeight}px`, overflow: "hidden" }}
              >
                {analysis.evidence}
              </p>

              {/* 悬停时显示完整内容的提示框 */}
              {/* {isTextTruncated && (
                <div className="absolute left-0 top-full mt-2 z-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="bg-gray-900 text-white text-sm p-3 rounded-lg shadow-lg max-w-md">
                    <p className="leading-relaxed">{analysis.evidence}</p>
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              )} */}

              {/* 渐变遮罩，当文本被截断时显示 */}
              {/* {isTextTruncated && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent dark:from-gray-800 pointer-events-none"></div>
              )} */}
            </div>

            {/* 情感分数指示器 */}
            {/* {analysis.sentiment_score !== undefined && (
              <div className="ml-2 flex items-center flex-shrink-0">
                <div
                  className={`h-2 w-2 rounded-full ${sentimentColor.replace("text-", "bg-")}`}
                ></div>
                <span className={`ml-1 text-xs ${sentimentColor}`}>
                  {analysis.sentiment_score > 0 ? "+" : ""}
                  {(analysis.sentiment_score * 100).toFixed(0)}%
                </span>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {typeof analysis.effect === "string" ? (
        <div className="flex items-center">
          <div className="mr-1 inline-flex w-[90px] items-center rounded-xl bg-green-200 px-2 py-1 text-sm text-green-700 dark:bg-green-100">
            <TrendingUpDown className="mr-1 h-4 w-4" />
            EFFECT
          </div>
          <p className="text-neutral-900/90 dark:text-neutral-100/90">{analysis.effect}</p>
        </div>
      ) : (
        <RecursiveCausal analysis={analysis.effect} />
      )}
    </div>
  );
};
