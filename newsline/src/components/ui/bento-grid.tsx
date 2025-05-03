import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("mx-auto grid max-w-7xl grid-cols-1 gap-6", className)}>{children}</div>
  );
};

export const BentoGridItem = ({
  className,
  timestamp,
  title,
  onClick,
}: {
  className?: string;
  timestamp: number;
  title: string;
  onClick?: () => void;
}) => {
  console.log(timestamp);
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className,
      )}
      onClick={onClick}
    >
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <time>{new Date(timestamp).toLocaleString()}</time>
        </div>
        <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
          {title}
        </div>
      </div>
    </div>
  );
};
