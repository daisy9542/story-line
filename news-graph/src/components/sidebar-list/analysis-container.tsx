"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface AnalysisContainerProps {
  eventTitle: string;
  analysisData: {
    title: string;
    content: string;
  }[];
  eventLines: {
    event: string;
    sentiment: number;
    date: string;
    url: string;
  }[];
}

export default function AnalysisContainer({
  eventTitle,
  analysisData,
  eventLines,
}: AnalysisContainerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(true);

  // 监听滚动事件
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleScroll = () => {
      // 计算滚动位置
      const scrollPosition =
        contentElement.scrollTop + contentElement.clientHeight;
      const scrollHeight = contentElement.scrollHeight;

      // 如果滚动到底部附近（距离底部20px以内），隐藏 More 按钮
      const isNearBottom = scrollHeight - scrollPosition < 20;

      console.log(
        "Scroll position:",
        scrollPosition,
        "Scroll height:",
        scrollHeight,
        "Is near bottom:",
        isNearBottom,
      );

      setShowMore(!isNearBottom);
    };

    // 初始检查是否需要显示 More 按钮
    const checkInitialOverflow = () => {
      // 如果内容高度小于容器高度，不需要显示 More
      if (contentElement.scrollHeight <= contentElement.clientHeight) {
        setShowMore(false);
      } else {
        // 初始检查滚动位置
        handleScroll();
      }
    };

    // 初始检查
    checkInitialOverflow();

    // 添加滚动事件监听
    contentElement.addEventListener("scroll", handleScroll);

    // 添加窗口大小变化监听，因为这可能会影响滚动高度
    window.addEventListener("resize", handleScroll);

    // 清理函数
    return () => {
      contentElement.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // 点击 More 按钮时滚动到底部
  const scrollToNextSection = () => {
    if (contentRef.current) {
      // 滚动到底部
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth", // 平滑滚动
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#1A1B1E] text-white">
      {/* 标题部分 */}
      <div className="p-3">
        <h1 className="leading-6">{eventTitle}</h1>
      </div>
      <div className="mx-3 border-t border-[rgba(255,255,255,0.1)]"></div>

      {/* 分析数据部分 - 添加 ref */}
      <div
        ref={contentRef}
        className="relative flex flex-1 flex-col space-y-6 overflow-y-auto p-3"
      >
        {/* 时间线部分 */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-[14px] leading-4 font-medium">Timeline</h2>
          <div className="flex flex-col space-y-3">
            {eventLines.map((event, index) => (
              <p key={index} className="text-sm font-light text-white/60">
                {event.date.includes("-")
                  ? `${event.date.split("-")[1]}月${event.date.split("-")[2]}日，`
                  : ""}
                {event.event}
              </p>
            ))}
          </div>
        </div>
        {analysisData.map((item, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <h2 className="text-[14px] leading-4 font-medium">{item.title}</h2>
            <p className="text-sm font-light text-white/60">{item.content}</p>
          </div>
        ))}

        {/* 底部留白，确保内容不会被 More 按钮遮挡 */}
        <div className="h-8"></div>
      </div>

      {/* More 按钮，根据 showMore 状态显示或隐藏 */}
      {showMore && (
        <div className="absolute right-0 bottom-4 left-0 flex justify-center">
          <button
            onClick={scrollToNextSection}
            className="flex !cursor-pointer items-center gap-1 rounded-full border border-gray-700 bg-[#2A2B30] px-5 py-2 text-gray-300 shadow-lg transition-all hover:bg-[#3A3B42] hover:text-white"
          >
            <span className="text-sm font-medium">More</span>
            <ChevronDown size={16} className="animate-bounce-slow" />
          </button>
        </div>
      )}
    </div>
  );
}
