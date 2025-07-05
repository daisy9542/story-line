import React, { useState, useEffect } from "react";
import { IViewpoint } from "@/types/report";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewpointProps {
  viewpoints: IViewpoint[];
}

export function Viewpoint({ viewpoints }: ViewpointProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: 左, 1: 右, 0: 初始
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 自动轮播
  useEffect(() => {
    if (!isAutoPlaying || viewpoints.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % viewpoints.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [viewpoints.length, isAutoPlaying]);

  // 如果没有观点数据，显示空状态
  if (!viewpoints.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No Viewpoints</p>
      </div>
    );
  }

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + viewpoints.length) % viewpoints.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % viewpoints.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // 获取实体类型
  const getEntityType = (entity: string): "analyst" | "executive" | "official" | "other" => {
    const lowerEntity = entity.toLowerCase();
    if (lowerEntity.includes("分析师") || lowerEntity.includes("analyst")) {
      return "analyst";
    }
    if (
      lowerEntity.includes("ceo") ||
      lowerEntity.includes("首席") ||
      lowerEntity.includes("总裁")
    ) {
      return "executive";
    }
    if (
      lowerEntity.includes("主席") ||
      lowerEntity.includes("官员") ||
      lowerEntity.includes("部长")
    ) {
      return "official";
    }
    return "other";
  };

  // 根据实体类型获取颜色
  const getEntityColor = (type: ReturnType<typeof getEntityType>) => {
    switch (type) {
      case "analyst":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "executive":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "official":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const currentViewpoint = viewpoints[currentIndex];
  const entityType = getEntityType(currentViewpoint.entity);
  const entityColor = getEntityColor(entityType);

  // 优化动画参数 - 减少切换时间和距离
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100, // 减少移动距离
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100, // 减少移动距离
      opacity: 0,
    }),
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm dark:border-gray-700/50 dark:bg-gray-900/80"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute top-4 left-4">
        <Quote className="h-5 w-5 text-gray-300 dark:text-gray-600" />
      </div>

      <div className="relative h-[180px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 400, // 增加弹性
              damping: 40,    // 增加阻尼
              duration: 0.3   // 限制最大持续时间
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-6 text-center"
          >
            {/* 作者标签 */}
            <span className={cn("mb-4 rounded-full px-4 py-2 text-sm font-medium", entityColor)}>
              {currentViewpoint.entity}
            </span>

            {/* 观点文字 */}
            <p className="mb-4 text-base font-normal text-gray-800 italic leading-relaxed dark:text-gray-200">
              &ldquo;{currentViewpoint.viewpoint}&rdquo;
            </p>

            {currentViewpoint.source_url && (
              <a
                href={currentViewpoint.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                <ExternalLink className="h-3 w-3" />
                <span>查看来源</span>
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 导航按钮 */}
      {viewpoints.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-3 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-100/80 text-gray-500 backdrop-blur-sm transition-all hover:bg-gray-200/80 hover:text-gray-700 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700/80 dark:hover:text-gray-200"
            aria-label="上一个观点"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-100/80 text-gray-500 backdrop-blur-sm transition-all hover:bg-gray-200/80 hover:text-gray-700 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700/80 dark:hover:text-gray-200"
            aria-label="下一个观点"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* 指示点 */}
          <div className="absolute bottom-3 left-0 flex w-full justify-center gap-2">
            {viewpoints.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-1.5 cursor-pointer rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-blue-500 dark:bg-blue-400"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
                aria-label={`跳转到第${index + 1}个观点`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
