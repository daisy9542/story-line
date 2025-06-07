import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NewsItem {
  id: string;
  title: string;
  tags?: string[];
  time: string;
}

export default function NewsItem({
  item,
  isSelected,
  onClick,
}: {
  item: NewsItem;
  isSelected: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <div
      className="w-full p-4 hover:bg-[rgb(31,32,33)]"
      onClick={() => onClick(item.id)}
    >
      <div
        className={cn(
          "text-[14px] leading-[18px] font-light text-[rgba(255,255,255,0.6)]",
          isSelected ? "text-white" : "",
        )}
      >
        {item.title}
      </div>
      <div className="mt-3 flex items-center justify-between leading-[18px]">
        <div
          className={cn(
            "text-[12px] font-light text-[rgba(255,255,255,0.3)]",
            isSelected ? "text-white" : "",
          )}
        >
          {item.time}
        </div>
      </div>
    </div>
  );
}
