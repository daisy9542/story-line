import { RangeImpl } from "@/lib/utils";
import { IRange, TimePointIndex } from "lightweight-charts";
import { TimedValue } from "../i-circle-markers";
import { lowerBound, upperBound } from "./algorithms";

export interface BitmapPositionLength {
  /** 在位图渲染中使用的起始坐标（像素） */
  position: number;
  /** 在位图渲染中使用的长度（像素） */
  length: number;
}

function centreOffset(lineBitmapWidth: number): number {
  // 计算宽度的一半并向下取整，用于居中偏移
  return Math.floor(lineBitmapWidth * 0.5);
}

/**
 * 根据给定的逻辑坐标（媒体坐标）和期望长度，计算在位图渲染中使用的起始坐标和长度，实现居中对齐。
 * @param positionMedia - 媒体坐标系中的位置（宽度或高度方向）
 * @param pixelRatio - 像素比（水平或垂直）
 * @param desiredWidthMedia - 媒体坐标系中期望的长度，默认为 1
 * @param widthIsBitmap - 如果为 true，则 desiredWidthMedia 已经是位图像素长度，不再乘以像素比
 * @returns 包含位图起始坐标 position 和位图长度 length 的对象
 */
export function positionsLine(
  positionMedia: number,
  pixelRatio: number,
  desiredWidthMedia: number = 1,
  widthIsBitmap?: boolean,
): BitmapPositionLength {
  // 将媒体坐标映射到位图坐标并取整
  const scaledPosition = Math.round(pixelRatio * positionMedia);
  // 如果 widthIsBitmap 为 true，直接使用 desiredWidthMedia，否则乘以像素比
  const lineBitmapWidth = widthIsBitmap
    ? desiredWidthMedia
    : Math.round(desiredWidthMedia * pixelRatio);
  // 计算居中偏移
  const offset = centreOffset(lineBitmapWidth);
  const position = scaledPosition - offset;
  return { position, length: lineBitmapWidth };
}

/**
 * 向上取整，并确保结果为奇数，以便在位图中中心像素对齐
 * @param x 要取整的数值
 * @returns 向上取整且为奇数的值
 */
export function ceiledOdd(x: number): number {
  const ceiled = Math.ceil(x);
  return ceiled % 2 === 0 ? ceiled - 1 : ceiled;
}

const enum Constants {
  /** 标记尺寸下限（逻辑像素） */
  MinShapeSize = 12,
  /** 标记尺寸上限（逻辑像素） */
  MaxShapeSize = 30,
  /** 最小形状间距（逻辑像素） */
  MinShapeMargin = 3,
}

/**
 * 根据当前柱宽计算出 marker 的尺寸（逻辑像素），并保证在 MinShapeSize 和 MaxShapeSize 之间。
 * 最终结果会乘以 coeff，再向上取奇数。
 * @param barSpacing - 柱子在水平方向上的宽度（逻辑像素）
 * @param coeff - 缩放系数
 * @returns 向上取整且为奇数的尺寸值
 */
export function size(barSpacing: number, coeff: number): number {
  // 先将 barSpacing 限制在 [MinShapeSize, MaxShapeSize] 之间，再乘以系数
  const result =
    Math.min(Math.max(barSpacing, Constants.MinShapeSize), Constants.MaxShapeSize) * coeff;
  return ceiledOdd(result);
}

export function shapeSize(originalSize: number): number {
  return size(originalSize, 3);
}

/**
 * 根据当前柱宽计算出 marker 与柱体之间的间距（逻辑像素），
 * 保证至少为 MinShapeMargin。
 * @param barSpacing - 柱子在水平方向上的宽度（逻辑像素）
 * @returns 计算出的最小间距值
 */
export function calcShapeMargin(barSpacing: number): number {
  // 使用 size(barSpacing, 0.1) 计算相对间距，并与最小间距比较取大
  return Math.max(size(barSpacing, 0.1), Constants.MinShapeMargin);
}

/**
 * 计算标记形状的高度（逻辑像素），并确保结果为偶数。
 * @param barSpacing - 当前柱体的宽度（逻辑像素）
 * @returns 计算后的形状高度（偶数，单位：逻辑像素）
 */
export function calcShapeHeight(barSpacing: number): number {
  const ceiled = Math.ceil(size(barSpacing, 1));
  return ceiled % 2 !== 0 ? ceiled - 1 : ceiled;
}

/**
 * 根据标记位置类型调整边距。
 * - 如果图形位于柱体外侧（hasSide 为 true），使用原始 margin。
 * - 否则若位于柱体内部（hasInBar 为 true），缩小为一半并向上取整。
 * - 否则返回 0，不占用额外空间。
 * @param margin - 原始边距值（逻辑像素）
 * @param hasSide - 是否有“在柱体上方/下方”的标记
 * @param hasInBar - 是否有“在柱体内部”的标记
 * @returns 调整后的边距值（逻辑像素）
 */
export function calcAdjustedMargin(margin: number, hasSide: boolean, hasInBar: boolean): number {
  if (hasSide) {
    return margin;
  } else if (hasInBar) {
    return Math.ceil(margin / 2);
  }

  return 0;
}

/**
 * 根据给定的时间范围，计算在 items 数组中对应的索引区间。
 * 可选地扩展范围，使得结果包含范围之外的一个数据点，用于防止在临界点漏绘。
 * @param items - 按时间排序的 TimedValue 数组
 * @param range - 包含可视区间第一个和最后一个时间点的 RangeImpl
 * @param extendedRange - 是否扩展范围，若为 true，则在必要时向前和向后各多取一个索引
 * @returns 一个对象，包含 { from, to }，表示 items 数组中需要处理的索引区间 [from, to)
 */
export function visibleTimedValues(
  items: TimedValue[],
  range: RangeImpl<TimePointIndex>,
  extendedRange: boolean,
): IRange<number> {
  // 可视区间的第一个和最后一个时间点
  const firstBar = range.left();
  const lastBar = range.right();

  // 使用二分查找确定 from 和 to 的初始索引
  // lowerBound 返回第一个 time >= firstBar 的索引
  const from = lowerBound(items, firstBar, (item, time) => item.time < time);
  // upperBound 返回第一个 time > lastBar 的索引
  const to = upperBound(items, lastBar, (item, time) => item.time > time);

  // 如果不需要扩展范围，直接返回 [from, to)
  if (!extendedRange) {
    return { from, to };
  }

  // 否则，初始化扩展后的索引
  let extendedFrom = from;
  let extendedTo = to;

  // 如果 from 不在数组边界，并且 items[from].time >= firstBar，向前扩一个元素
  if (from > 0 && from < items.length && items[from].time >= firstBar) {
    extendedFrom = from - 1;
  }

  // 如果 to 不在数组边界，并且 items[to - 1].time <= lastBar，向后扩一个元素
  if (to > 0 && to < items.length && items[to - 1].time <= lastBar) {
    extendedTo = to + 1;
  }

  return { from: extendedFrom, to: extendedTo };
}
