import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { RGBColor } from "@/types/graph";

/**
 * 合并类名
 *
 * @param inputs 类名数组
 * @returns 合并后的类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化数字为带单位的字符串
 *
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatDigital(num: number, fixed = 1) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(fixed) + "K";
  return num.toFixed(fixed);
}

/**
 * 解析颜色字符串
 *
 * @param color 颜色字符串，支持 hex 和 rgb 格式
 * @returns 包含 r、g、b 三个属性的对象
 */
function parseColor(color: string): RGBColor {
  if (color.startsWith("#")) {
    // 处理 hex 格式，比如 #ffffff
    const hex = color.slice(1);
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  } else if (color.startsWith("rgb")) {
    // 处理 rgb 或 rgba 格式
    const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const [_, r, g, b] = match;
      return { r: Number(r), g: Number(g), b: Number(b) };
    }
  }
  // fallback 灰色
  return { r: 156, g: 163, b: 175 };
}

/**
 * 根据分数分级映射颜色
 *
 * @param score 对币种的情绪分值，范围 -100 到 100
 * @param opacity 透明度，范围 0 到 1，1 表示完全不透明
 * @returns 颜色对象，包含 fillColor 和 strokeColor
 */
export function score2color(score: number, opacity: number) {
  const NEGATIVE_PALETTE = [
    "#fee2e2", // 轻微负向
    "#fecaca",
    "#fca5a5",
    "#f87171",
    "#ef4444", // 强烈负向
  ];
  const POSITIVE_PALETTE = [
    "#d1fae5", // 轻微正向
    "#a7f3d0",
    "#6ee7b7",
    "#34d399",
    "#10b981", // 强烈正向
  ];
  const NEUTRAL_COLOR = "#9ca3af"; // 中性
  const thresholds = [0.1, 0.2, 0.4, 0.6, 1.0];
  const absNorm = Math.min(1, Math.abs(score) / 100);

  let idx = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (absNorm <= thresholds[i]) {
      idx = i;
      break;
    }
  }

  let strokeColor: string;
  if (score > 0) {
    strokeColor = POSITIVE_PALETTE[idx];
  } else if (score < 0) {
    strokeColor = NEGATIVE_PALETTE[idx];
  } else {
    strokeColor = NEUTRAL_COLOR;
  }

  const c = parseColor(strokeColor);
  const fillColor = c
    ? `rgba(${c.r},${c.g},${c.b},${opacity})`
    : `rgba(156,163,175,${opacity})`;

  return { strokeColor, fillColor };
}
