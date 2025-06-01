import { clsx, type ClassValue } from "clsx";
// utils/relativeTime.ts
import { differenceInSeconds, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 将一个 Date、Unix 时间戳（秒或毫秒）转成 “Xm”/“Xh”/“Xd”等格式
 *  - 如果差值 < 60 秒：显示 “Xs”
 *  - 如果差值 < 60 分钟：显示 “Xm”
 *  - 如果差值 < 24 小时：显示 “Xh”
 *  - 如果差值 < 7 天：显示 “Xd”
 *  - 超过 7 天：显示 “Xw” 或者直接返回实际日期格式
 *
 * @param timestamp 输入可以是：
 *    - 秒级 Unix (例如 1656630000)
 *    - 毫秒级 Unix (例如 1656630000000)
 *    - Date 对象
 * @returns 类似 “23m” / “5h” / “2d” / “1w” / “MMM d, yyyy” 之类的字符串
 */
export function toRelativeShort(timestamp: number | Date): string {
  const now = new Date();
  const tDate =
    timestamp instanceof Date ? timestamp : normalizeTimestamp(timestamp);

  const diffInSeconds = differenceInSeconds(now, tDate);

  // 少于 60 秒，用 Xs
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  // 少于 60 分钟，用 Xm
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  // 少于 24 小时，用 Xh
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  // 少于 7 天，用 Xd
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  // 少于 4 周，用 Xw
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  }

  // 超过 4 周，可以返回格式化的日期，比如 “May 29, 2025”
  // 也可以返回具体差值 “Xm ago”，看你需求
  return tDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** 辅助：将秒级或毫秒级时间戳统一为 JS Date 对象 */
function normalizeTimestamp(ts: number): Date {
  // 如果看起来像秒级（小于 10^12），则乘以 1000 转成毫秒
  if (ts < 1e12) {
    return new Date(ts * 1000);
  }
  return new Date(ts);
}
