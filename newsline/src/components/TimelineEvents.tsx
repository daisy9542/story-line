import React from "react";

export default function TimelineEvents() {
  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="min-w-[800px] flex gap-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="min-w-[200px] p-4 bg-blue-100 rounded-lg shadow text-sm"
          >
            <p className="font-bold">事件标题 {i + 1}</p>
            <p className="text-gray-600">2024-04-30</p>
            <p className="text-gray-700 mt-2">这是一个新闻摘要...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
