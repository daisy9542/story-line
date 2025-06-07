"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventTimeline from "@/components/sidebar-list/event-timeline";

interface AnalysisItem {
  title: string;
  content: string;
}

interface EventLine {
  event: string;
  sentiment: number;
  date: string;
  url: string;
}

interface AnalysisContainerProps {
  eventTitle: string;
  analysisData: AnalysisItem[];
  eventLines: EventLine[];
}

export default function AnalysisContainer({
  eventTitle,
  analysisData,
  eventLines,
}: AnalysisContainerProps) {
  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-gray-800 bg-[#0D0D0D] text-white">
      {/* 标题部分 - 固定高度 */}
      {/* <div className="border-b border-gray-800 p-4">
        <h2 className="text-lg font-semibold">{eventTitle}</h2>
      </div> */}

      {/* Tabs组件 - 占据剩余空间 */}
      <Tabs defaultValue="timeline" className="flex-1 flex flex-col">
        {/* 标签栏 - 固定高度 */}
        <TabsList className="m-4 grid w-[calc(100%-2rem)] grid-cols-2">
          <TabsTrigger value="timeline" className="cursor-pointer">Timeline</TabsTrigger>
          <TabsTrigger value="analysis" className="cursor-pointer">Analysis</TabsTrigger>
        </TabsList>

        {/* 内容区域 - 可滚动 */}
        <div className="flex-1 relative">
          {/* Timeline标签内容 */}
          <TabsContent
            value="timeline"
            className="absolute inset-0 overflow-y-auto px-4 pb-4 pt-2 cursor-pointer"
          >
            <EventTimeline events={eventLines} />
          </TabsContent>

          {/* Analysis标签内容 */}
          <TabsContent
            value="analysis"
            className="absolute inset-0 overflow-y-auto p-4 cursor-pointer"
          >
            <div className="space-y-4">
              {analysisData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-[14px] leading-4 font-medium">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light text-white/60">{item.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
