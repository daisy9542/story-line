import { title } from "process";

import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  tags: string[];
  time: string;
}

export default function AnalysisItem({ item }) {
  return (
    <div className="hover:bg-[rgb(31,32,33)]">
      <div className="mb-1 text-white">{item.title}</div>
      <div className="text-base/[18px] text-gray-500">{item.content}</div>
    </div>
  );
}
