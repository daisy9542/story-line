import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化日期 - 通用日期格式化函数
export function formatDate(
  dateStr: string,
  options?: {
    format?: "full" | "short" | "iso";
    locale?: string;
  },
): string {
  const { format = "iso", locale = "zh-CN" } = options || {};
  const date = new Date(dateStr);

  switch (format) {
    case "full":
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    case "short":
      return date.toLocaleDateString(locale, {
        month: "numeric",
        day: "numeric",
        weekday: "short",
      });
    case "iso":
    default:
      return date
        .toLocaleDateString(locale, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");
  }
}

// 情感分数颜色映射 - 通用情感颜色函数
export function getSentimentColor(
  sentimentScore?: number,
  type: "bg" | "text" | "border" = "bg",
): string {
  const prefix = type === "bg" ? "bg-" : type === "text" ? "text-" : "border-";

  if (!sentimentScore) {
    return `${prefix}gray-400 dark:${prefix}gray-500`;
  }

  if (sentimentScore > 0.3) {
    return `${prefix}emerald-500 dark:${prefix}emerald-400`;
  }

  if (sentimentScore < -0.3) {
    return `${prefix}red-500 dark:${prefix}red-400`;
  }

  return `${prefix}blue-500 dark:${prefix}blue-400`;
}

// 情感分数标签 - 获取情感文字描述
export function getSentimentLabel(sentimentScore?: number): string {
  if (!sentimentScore) return "中性";
  if (sentimentScore > 0.3) return "正面";
  if (sentimentScore < -0.3) return "负面";
  return "中性";
}

// 情感分数等级 - 获取情感强度等级(1-5)
export function getSentimentLevel(sentimentScore?: number): number {
  if (!sentimentScore) return 1;
  const absScore = Math.abs(sentimentScore);
  if (absScore >= 0.8) return 5;
  if (absScore >= 0.6) return 4;
  if (absScore >= 0.4) return 3;
  if (absScore >= 0.2) return 2;
  return 1;
}

export class RangeImpl<T extends number> {
  private readonly _left: T;
  private readonly _right: T;

  public constructor(left: T, right: T) {
    this._left = left;
    this._right = right;
  }

  public left(): T {
    return this._left;
  }

  public right(): T {
    return this._right;
  }

  public count(): number {
    return this._right - this._left + 1;
  }

  public contains(index: T): boolean {
    return this._left <= index && index <= this._right;
  }

  public equals(other: RangeImpl<T>): boolean {
    return this._left === other.left() && this._right === other.right();
  }
}
